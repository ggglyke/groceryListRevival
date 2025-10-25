import React, { useState, useEffect } from "react";
import { ListGroup, Dropdown, Form } from "react-bootstrap";
import { BsExclamationTriangle } from "react-icons/bs";

export default function ProductItem({
  product,
  deleteProduct,
  currentProduct,
  updateProduct,
  aisles,
  onEdit,
  onCancelEdit,
}) {
  const sortedAisles = [...aisles].sort((a, b) =>
    a.title.localeCompare(b.title, "fr", { sensitivity: "base" })
  );
  const isEditing = currentProduct?._id === product._id;
  const [productData, setProductData] = useState({
    title: "",
    aisleId: "",
  });

  useEffect(() => {
    if (isEditing) {
      setProductData({
        title: product.title || "",
        aisleId: product.rayon?._id || product.rayon || "",
      });
    }
  }, [isEditing, product]);

  const handleDelete = () => {
    if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      deleteProduct(product._id);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!productData.title || !productData.aisleId) {
      return;
    }
    await updateProduct(product._id, productData);
  };

  return (
    <ListGroup.Item className="d-flex align-items-center justify-content-between">
      {!isEditing ? (
        <>
          {/* Mode normal - affichage des infos */}
          <div className="d-flex flex-column">
            {product.title}
            <div className="text-muted text-small">
              {product.rayon && (
                <span>
                  {product.rayon.title}
                  {" - "}
                </span>
              )}
              <span>
                {!product.times_added
                  ? "0 ajout"
                  : product.times_added === 1
                  ? "1 ajout"
                  : product.times_added + " ajouts"}
              </span>
            </div>
          </div>
          <div className="edit">
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                id="dropdown-basic"
              ></Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => onEdit(product)}>
                  Modifier
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleDelete}>
                  <div className="text-danger d-flex align-items-center">
                    <BsExclamationTriangle className="me-1" />
                    Supprimer
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </>
      ) : (
        <>
          {/* Mode édition - formulaire inline */}
          <Form
            onSubmit={handleSubmitEdit}
            className="inline-edit-form flex-grow-1"
          >
            <div className="inline-edit-form__fields">
              <Form.Control
                type="text"
                required
                value={productData.title}
                onChange={(e) =>
                  setProductData({ ...productData, title: e.target.value })
                }
                placeholder="Nom du produit"
                autoFocus
                className="inline-edit-form__input"
              />
              <Form.Select
                value={productData.aisleId}
                onChange={(e) =>
                  setProductData({ ...productData, aisleId: e.target.value })
                }
                required
                className="inline-edit-form__select"
              >
                <option value="">Rayon</option>
                {sortedAisles.map((aisle) => (
                  <option key={aisle._id} value={aisle._id}>
                    {aisle.title}
                  </option>
                ))}
              </Form.Select>
            </div>
            <div className="inline-edit-form__actions">
              <button
                type="submit"
                className="btn btn-success btn-sm text-nowrap"
              >
                Valider
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm text-nowrap"
                onClick={onCancelEdit}
              >
                Annuler
              </button>
            </div>
          </Form>
        </>
      )}
    </ListGroup.Item>
  );
}
