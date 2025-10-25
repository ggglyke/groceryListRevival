import React, { useState } from "react";
import { Form, Button, Dropdown } from "react-bootstrap";
import { FaCog } from "react-icons/fa";
import { BsExclamationTriangle } from "react-icons/bs";

export default function MagasinHeader({
  magasin,
  updateMagasinTitle,
  onDeleteMagasin,
}) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(magasin?.title || "");

  const handleSubmitTitle = async (e) => {
    e.preventDefault();
    if (!titleValue.trim()) return;

    const result = await updateMagasinTitle(titleValue);
    if (result?.success) {
      setEditingTitle(false);
    }
  };

  const handleCancelEdit = () => {
    setTitleValue(magasin?.title || "");
    setEditingTitle(false);
  };

  return (
    <>
      {editingTitle ? (
        <Form onSubmit={handleSubmitTitle}>
          <Form.Group controlId="magasinNewName">
            <Form.Label className="smallUnderLabel">
              Nouveau nom pour le magasin
            </Form.Label>
            <Form.Control
              type="text"
              className="form-control editInput"
              required
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              autoFocus
            />
          </Form.Group>
          <div className="mt-2">
            <Button type="submit" variant="primary" className="me-2" size="sm">
              Mettre à jour
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleCancelEdit}
            >
              Annuler
            </Button>
          </div>
        </Form>
      ) : (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>{magasin?.title}</h1>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
              <FaCog />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setEditingTitle(true)}>
                Renommer
              </Dropdown.Item>

              <Dropdown.Divider />

              <Dropdown.Item onClick={onDeleteMagasin}>
                <div className="text-danger d-flex align-items-center">
                  <BsExclamationTriangle className="me-1" />
                  Supprimer le magasin
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}
    </>
  );
}
