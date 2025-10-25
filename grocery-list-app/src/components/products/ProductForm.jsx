import React, { useState } from "react";
import { Form } from "react-bootstrap";
import "./ProductForm.scss";

export default function ProductForm({ aisles, createProduct }) {
  const [productData, setProductData] = useState({
    title: "",
    aisleId: "",
  });
  const [showAisleField, setShowAisleField] = useState(false);

  // Trier les rayons par ordre alphabétique
  const sortedAisles = [...aisles].sort((a, b) =>
    a.title.localeCompare(b.title, "fr", { sensitivity: "base" })
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productData.title || !productData.aisleId) {
      return;
    }
    const result = await createProduct(productData);
    if (result?.success) {
      setProductData({ title: "", aisleId: "" });
      setShowAisleField(false); // Réinitialiser l'état d'affichage
    }
  };

  const handleTitleFocus = () => {
    setShowAisleField(true);
  };

  return (
    <Form onSubmit={handleSubmit} className="my-3 product-form">
      <Form.Group controlId="newProductTitle" className="mb-3">
        <Form.Label>Nom du nouveau produit :</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ex : Lait"
          value={productData.title}
          onChange={(e) =>
            setProductData({ ...productData, title: e.target.value })
          }
          onFocus={handleTitleFocus}
          required
        />
      </Form.Group>

      <Form.Group
        controlId="newProductAisle"
        className={`mb-3 product-form__aisle-field ${
          showAisleField ? "product-form__aisle-field--visible" : ""
        }`}
      >
        <Form.Label>Rayon :</Form.Label>
        <Form.Select
          value={productData.aisleId}
          onChange={(e) =>
            setProductData({ ...productData, aisleId: e.target.value })
          }
          required
        >
          <option value="">Choisir un rayon</option>
          {sortedAisles.map((aisle) => (
            <option key={aisle._id} value={aisle._id}>
              {aisle.title}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <div className="product-form__submit-wrapper">
        <input
          className="btn btn-primary mt-2"
          type="submit"
          value="Ajouter le produit"
        />
      </div>
    </Form>
  );
}
