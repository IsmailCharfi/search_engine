import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch } from "../store";
import { API_PATH } from "../api";
import { toast } from "react-toastify";
import { dispatchSearchResult } from "../store/appReducer";

const SearchQueryInput = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  const handleInputChange = (e: any) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
  };

  const handleSearch = async () => {
    const formData = new FormData();
    formData.append("query", query);
    const response = await fetch(`${API_PATH}/search`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      //@ts-ignore
      dispatch(dispatchSearchResult(data));
    } else {
      toast("An error has occured", {
        type: "error",
        autoClose: 2000,
      });
    }
  };

  return (
    <div>
      <Form.Group className="mb-3">
        <Form.Label>Query</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          onChange={handleInputChange}
          value={query}
        />
      </Form.Group>
      <Form.Group className="mb-3 d-flex algin-items-center justify-content-end">
        <Button onClick={handleSearch}>Search</Button>
      </Form.Group>
    </div>
  );
};

export default SearchQueryInput;
