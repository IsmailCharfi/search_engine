import os
import shutil

from flask import Flask, jsonify, request
from flask_cors import CORS
import mimetypes
from indexer import update_indexes, read_json, apply_ocr
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

from search import filter_from_index

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///search-engine.db'
db = SQLAlchemy(app)
CORS(app)


class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String(20), unique=True, nullable=False)
    name = db.Column(db.String(120))
    ext = db.Column(db.String(120))
    date = db.Column(db.String(255))
    _type = db.Column(db.String(255))
    language = db.Column(db.String(255))
    keywords = db.Column(db.String(255))
    category = db.Column(db.String(255))
    size = db.Column(db.Integer)

    @staticmethod
    def to_json(document):
        return {
            'id': document.id,
            'path': document.path,
            'name': document.name,
            'ext': document.ext,
            'date': document.date,
            'type': document._type,
            'language': document.language,
            'keywords': document.keywords,
            'category': document.category,
            'size': document.size
        }

    @staticmethod
    def getAll():
        data = Document.query.all()
        return [Document.to_json(document) for document in data]


@app.route('/documents', methods=['GET'])
def documents():
    return jsonify(Document.getAll())


@app.route('/indexes', methods=['GET'])
def indexes():
    db.create_all()
    return jsonify(read_json("./index.json"))


@app.route('/search', methods=['POST'])
def search_docs():
    paths = filter_from_index(request.form.get('query'), read_json("./index.json"))
    paths = list(set(paths))
    return jsonify([Document.to_json(document) for document in Document.query.filter(Document.path.in_(paths)).all()])


@app.route('/indexes', methods=['POST'])
def updateIndex():
    if 'document' not in request.files:
        return jsonify({}), 500

    file = request.files['document']

    if file.filename == '':
        return jsonify({}), 500

    path = './documents/' + file.filename

    file.save(path)
    filename, ext = os.path.splitext(file.filename)
    new_document = Document(
        path=path,
        name=filename,
        ext=ext.lstrip("."),
        _type=mimetypes.guess_type(path)[0],
        date=datetime.fromtimestamp(os.path.getctime(path)).strftime("%Y-%m-%d %H:%M:%S"),
        language=request.form.get('language'),
        category=request.form.get('category'),
        keywords=request.form.get('keywords'),
        size=os.path.getsize(path),
    )
    update_indexes(new_document)

    db.session.add(new_document)
    db.session.commit()

    return jsonify({
        "indexes": read_json("./index.json"),
        'documents': Document.getAll()
    })


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
