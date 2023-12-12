import {
  Accordion,
  Button,
  Container,
  Form,
  Modal,
  Row,
  Stack,
} from "react-bootstrap";
import { useDispatch, useSelector } from "../store";
import { FormEvent, useState } from "react";
import { API_PATH } from "../api";
import { toast } from "react-toastify";
import { dispatchDocuments, dispatchIndexes } from "../store/appReducer";
import FileList from "./FileDisplayer";

export default function Indexes() {
  const { indexes, documents } = useSelector((state) => state);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    //@ts-ignore
    if (!event.target.document.files.length) {
      return;
    }

    const response = await fetch(`${API_PATH}/indexes`, {
      method: "POST",
      body: new FormData(event.target as HTMLFormElement),
    });

    if (response.ok) {
      const data = await response.json();
      //@ts-ignore
      dispatch(dispatchIndexes(data.indexes));
      //@ts-ignore
      dispatch(dispatchDocuments(data.documents));
      setShow(false);
      toast("Indexes are updated", {
        type: "success",
        autoClose: 2000,
      });
    } else {
      toast("An error has occured", {
        type: "error",
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <Stack gap={3} style={{ marginTop: "3rem", marginBottom: "3rem" }}>
        <Row>
          <Container
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <h4>Documents</h4>
            <Button onClick={() => setShow(true)}>Add a document</Button>
          </Container>
          <FileList documents={documents} />
        </Row>
        <Row>
          <Container style={{ marginBottom: "0.5rem" }}>
            <h4>Indexes</h4>
          </Container>
          <Accordion>
            {Object.keys(indexes)
              .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
              .map((key, index) => (
                <Accordion.Item eventKey={index.toLocaleString()} key={key}>
                  <Accordion.Header>{key.toUpperCase()} INDEX</Accordion.Header>
                  <Accordion.Body>
                    <pre>
                      <code>
                        {
                          //@ts-ignore
                          JSON.stringify(indexes[key], null, 2)
                        }
                      </code>
                    </pre>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
          </Accordion>
        </Row>
      </Stack>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add a document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Document</Form.Label>
              <Form.Control type="file" name="document" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" name="category" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Language</Form.Label>
              <Form.Control type="text" name="language" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Keywords (separated by ",")</Form.Label>
              <Form.Control as="textarea" rows={2} name="keywords" />
            </Form.Group>
            <Container
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
              }}
            >
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Container>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
