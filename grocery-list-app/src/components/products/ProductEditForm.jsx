import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";

export default function ProductEditForm({
  product,
  aisles,
  updateProduct,
  onCancel,
}) {
  const [productData, setProductData] = useState({
    title: "",
    aisleId: "",
  });

  useEffect(() => {
    if (product) {
      setProductData({
        title: product.title || "",
        aisleId: product.rayon?._id || product.rayon || "",
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productData.title || !productData.aisleId) {
      return;
    }
    const result = await updateProduct(product._id, productData);
    if (result?.success) {
      onCancel();
    }
  };

  if (!product) return null;

  // Trier les rayons par ordre alphabétique
  const sortedAisles = [...aisles].sort((a, b) => {
    const titleA = (a.title || "").toLowerCase();
    const titleB = (b.title || "").toLowerCase();
    return titleA.localeCompare(titleB);
  });

  return (
    <Modal show={!!product} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier le produit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
              {sortedAisles.map((aisle) => (
                <option key={aisle._id} value={aisle._id}>
                  {aisle.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onCancel}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Enregistrer
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
