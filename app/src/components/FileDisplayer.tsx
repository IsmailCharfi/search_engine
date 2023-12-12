import { Table } from "react-bootstrap";
import type { Document } from "../store/appReducer";

const FileDisplayer = ({ documents }: { documents: Document[] }) => {
  function formatFileSize(sizeInBytes: number) {
    const units = ["B", "KB", "MB", "GB", "TB"];

    let size = sizeInBytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    size = parseFloat(size.toFixed(2));

    return size + " " + units[unitIndex];
  }

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Ext</th>
            <th>Type</th>
            <th>Category</th>
            <th>Date Time</th>
            <th>Size</th>
            <th>Language</th>
            <th>Keywords</th>
            <th>Path</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc: Document) => (
            <tr key={doc.id}>
              <td>{doc.name ?? "-"}</td>
              <td>{doc.ext ?? "-"}</td>
              <td>{doc.type ?? "-"}</td>
              <td>{doc.category ?? "-"}</td>
              <td>{doc.date ?? "-"}</td>
              <td>{doc.size ? formatFileSize(doc.size) : "-"}</td>
              <td>{doc.language ?? "-"}</td>
              <td>{doc.keywords ?? "-"}</td>
              <td>{doc.path ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {documents.length == 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "-1rem",
            border: "0.5px solid #dee2e6",
            borderTop: "0px solid white",
          }}
        >
          No Documents
        </div>
      )}
    </>
  );
};

export default FileDisplayer;
