import json
from datetime import datetime
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from PIL import Image
import pytesseract

nltk.download('stopwords')
nltk.download('punkt')


def update_indexes(document):
    index = read_json("./index.json")

    update_auto_indexes(index, "name", document.name, document)
    update_auto_indexes(index, "type", document._type, document)
    update_auto_indexes(index, "size", document.size, document)
    update_auto_indexes(index, "ext", document.ext, document)

    if len(document.language) > 0:
        update_auto_indexes(index, "language", document.language, document)

    if len(document.category) > 0:
        update_auto_indexes(index, "category", document.category, document)

    if len(document.keywords) > 0:
        keywords = [word.strip() for word in document.keywords.split(',')]
        for keyword in keywords:
            update_auto_indexes(index, "keywords", keyword, document)

    if len(document.date) > 0:
        date_object = datetime.strptime(document.date, "%Y-%m-%d %H:%M:%S")
        update_auto_indexes(index, "date", date_object.date().strftime('%Y-%m-%d'), document)
        update_auto_indexes(index, "time", date_object.time().strftime('%H:%M:%S'), document)

    update_content_index(index["content"], document)

    write_json("./index.json", index)


def update_auto_indexes(indexes, key, content, document):
    if content not in indexes[key]:
        indexes[key][content] = []

    indexes[key][content].append(document.path)


def update_content_index(index, document):
    if "image" in document._type:
        content = apply_ocr(document.path)
    else:
        with open(document.path, 'r', encoding='utf-8') as file:
            content = file.read()

    sentences = sent_tokenize(content)
    stop_words = set(stopwords.words('english'))
    file_index = {}
    for i, sentence in enumerate(sentences):
        words = word_tokenize(sentence.lower())

        filtered_words = [word for word in words if word.isalnum() and word not in stop_words]

        for word in filtered_words:
            if word not in file_index:
                file_index[word] = 0
            file_index[word] = file_index[word] + 1

    for word in file_index:
        if word not in index:
            index[word] = []
        index[word].append({"path": document.path, "occ": file_index[word]})


def read_json(path):
    with open(path, 'r') as file:
        return json.load(file)


def write_json(path, json_dict):
    with open(path, 'w') as json_file:
        json.dump(json_dict, json_file)


def apply_ocr(image_path):
    try:
        image = Image.open(image_path)
        ocr_result = pytesseract.image_to_string(image)
        return ocr_result
    except Exception as e:
        print(f"OCR failed: {str(e)}")
        return None
