import React, { useState } from "react";
import { Form } from "react-bootstrap";
import "./AisleForm.scss";

export default function AisleForm({ createAisle }) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const result = await createAisle({ title });
    if (result?.success) {
      setTitle(""); // Réinitialiser le formulaire après succès
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="my-3 aisle-form">
      <Form.Group controlId="newAisleTitle" className="mb-3">
        <Form.Label>Nom du nouveau rayon :</Form.Label>
        <Form.Control
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex : fruits et légumes"
        />
      </Form.Group>
      <div className="aisle-form__submit-wrapper">
        <input
          className="btn btn-primary mt-2"
          type="submit"
          value="Ajouter le rayon"
        />
      </div>
    </Form>
  );
}
