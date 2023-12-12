import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import { useRoutes } from "react-router-dom";
import Indexes from "./components/Indexes";
import SearchEngine from "./components/SearchEngine";
import { useDispatch } from "./store";
import { useEffect } from "react";
import { dispatchDocuments, dispatchIndexes } from "./store/appReducer";
import { toast } from "react-toastify";
import { API_PATH } from "./api";

function App() {
  const content = useRoutes([
    {
      path: "",
      element: <Indexes />,
    },
    {
      path: "search-engine",
      element: <SearchEngine />,
    },
  ]);
  const dispatch = useDispatch();

  useEffect(() => {
    (async function () {
      let response = await fetch(`${API_PATH}/indexes`);
      if (response.ok) {
        const indexes = await response.json();
        //@ts-ignore
        dispatch(dispatchIndexes(indexes));
      } else {
        toast("An Error has occured", { type: "error", autoClose: 2000 });
      }

      response = await fetch(`${API_PATH}/documents`);
      if (response.ok) {
        const documents = await response.json();
        //@ts-ignore
        dispatch(dispatchDocuments(documents));
      } else {
        toast("An Error has occured", { type: "error", autoClose: 2000 });
      }
    })();
  }, []);

  return (
    <>
      <Navbar expand="lg" style={{ backgroundColor: "#e3f2fd" }}>
        <Container>
          <Navbar.Brand>TP SRI</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <LinkContainer to="">
                <Nav.Link>Indexes</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/search-engine">
                <Nav.Link>Search Engine</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>{content}</Container>
    </>
  );
}

export default App;
