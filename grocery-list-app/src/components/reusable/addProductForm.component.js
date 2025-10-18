/* React */
import React from "react";
import { useState } from "react";

/* libraries */
import { Link } from "react-router-dom";

/* react-bootstrap */
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

/* own components */

/* scss */
import "../../scss/main.scss";
import { FormGroup } from "react-bootstrap";

/* data */

const AddProductForm = ({ rayons, placeholder, onAddProduct }) => {
  const [productName, setProductName] = useState();
  const [rayon, setRayon] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = { title: productName, rayon: rayon };
    onAddProduct(newProduct);
  };

  return (
    <div className="mb-4">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="autocompleteProducts">
          <Form.Label className="mb-2 fw-bold">
            Ajouter un produit à la liste :
          </Form.Label>
          <Form.Control
            type="text"
            placeholder={placeholder}
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </Form.Group>
        <FormGroup className="mt-3">
          <Form.Label className="mb-2 fw-bold">Attribuer un rayon :</Form.Label>
          <Form.Select onChange={(e) => setRayon(e.target.value)}>
            {rayons.map((rayon) => (
              <option>{rayon.title}</option>
            ))}
          </Form.Select>
        </FormGroup>
        <div className="d-grid gap-2">
          <Button variant="primary" type="submit" className="mt-3">
            Ajouter
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddProductForm;
