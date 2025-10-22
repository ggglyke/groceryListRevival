import React from "react";
import { ListGroup, Dropdown } from "react-bootstrap";
import { BsExclamationTriangle } from "react-icons/bs";

export default function ProductItem({ product, deleteProduct, onEdit }) {
  const handleDelete = () => {
    if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      deleteProduct(product._id);
    }
  };

  return (
    <ListGroup.Item className="d-flex align-items-start flex-column">
      <div className="d-flex align-self-stretch justify-content-between">
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
      </div>
    </ListGroup.Item>
  );
}
