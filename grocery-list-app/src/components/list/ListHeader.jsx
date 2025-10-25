import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Dropdown } from "react-bootstrap";
import { FaCog } from "react-icons/fa";
import { BsExclamationTriangle } from "react-icons/bs";

export default function ListHeader({
  list,
  magasins,
  updateListTitle,
  changeMagasin,
  onDeleteCheckedProducts,
  onDeleteAllProducts,
  onDeleteList,
}) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(list?.title || "");

  const handleSubmitTitle = async (e) => {
    e.preventDefault();
    if (!titleValue.trim()) return;

    const result = await updateListTitle(titleValue);
    if (result?.success) {
      setEditingTitle(false);
    }
  };

  const handleCancelEdit = () => {
    setTitleValue(list?.title || "");
    setEditingTitle(false);
  };

  const handleChangeMagasin = (e) => {
    changeMagasin(e.target.value);
  };

  return (
    <>
      {/* Titre et actions */}
      {editingTitle ? (
        <Form onSubmit={handleSubmitTitle}>
          <Form.Group controlId="listNewName">
            <Form.Label className="smallUnderLabel">
              Nouveau nom pour la liste
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
          <h1>{list?.title}</h1>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
              <FaCog />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {list?.checkedProducts?.length > 0 && (
                <Dropdown.Item onClick={onDeleteCheckedProducts}>
                  Supprimer les produits cochés
                </Dropdown.Item>
              )}

              {(list?.products?.length > 0 ||
                list?.customProducts?.length > 0) && (
                <Dropdown.Item onClick={onDeleteAllProducts}>
                  Vider
                </Dropdown.Item>
              )}

              <Dropdown.Item onClick={() => setEditingTitle(true)}>
                Renommer
              </Dropdown.Item>

              <Dropdown.Divider />

              <Dropdown.Item onClick={onDeleteList}>
                <div className="text-danger d-flex align-items-center">
                  <BsExclamationTriangle className="me-1" />
                  Supprimer la liste
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}

      {/* Sélection du magasin */}
      <div className="my-4">
        <Form>
          <Form.Group controlId="selectShop">
            <Form.Label className="fw-bold">Magasin :</Form.Label>
            <Form.Select
              aria-label="Sélectionner un magasin"
              value={list?.magasin?._id || list?.magasin || ""}
              onChange={handleChangeMagasin}
            >
              {magasins.map((magasin) => (
                <option value={magasin._id} key={magasin._id}>
                  {magasin.title}
                </option>
              ))}
            </Form.Select>
            <span className="text-small muted ps-2">
              <Link to="/magasins">Gérer les magasins</Link>
            </span>
          </Form.Group>
        </Form>
      </div>
    </>
  );
}
