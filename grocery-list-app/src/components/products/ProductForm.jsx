import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function ProductForm({ aisles, createProduct }) {
  const [productData, setProductData] = useState({
    title: "",
    aisleId: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productData.title || !productData.aisleId) {
      return;
    }
    const result = await createProduct(productData);
    if (result?.success) {
      setProductData({ title: "", aisleId: "" });
    }
  };

  return (
    <div className="mb-4 p-3 border rounded">
      <h5 className="mb-3">Ajouter un produit</h5>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nom du produit</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ex: Lait"
            value={productData.title}
            onChange={(e) =>
              setProductData({ ...productData, title: e.target.value })
            }
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Rayon</Form.Label>
          <Form.Select
            value={productData.aisleId}
            onChange={(e) =>
              setProductData({ ...productData, aisleId: e.target.value })
            }
            required
          >
            <option value="">Choisir un rayon</option>
            {aisles.map((aisle) => (
              <option key={aisle._id} value={aisle._id}>
                {aisle.title}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          Ajouter
        </Button>
      </Form>
    </div>
  );
}
