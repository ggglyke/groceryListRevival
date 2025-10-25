import React from "react";
import { Link } from "react-router-dom";
import { ListGroup, Dropdown, Form } from "react-bootstrap";
import { BsExclamationTriangle } from "react-icons/bs";
import Moment from "react-moment";

export default function MagasinItem({
  magasin,
  deleteMagasin,
  updateMagasin,
  currentMagasin,
  setCurrentMagasin,
  editMagasinTitle,
  setEditMagasinTitle,
}) {
  const isEditing = currentMagasin?._id === magasin._id;

  const handleDelete = () => {
    if (
      window.confirm("Voulez-vous vraiment supprimer ce magasin ?")
    ) {
      deleteMagasin(magasin._id);
    }
  };

  const handleEdit = () => {
    setCurrentMagasin(magasin);
    setEditMagasinTitle(magasin.title);
  };

  const handleCancelEdit = () => {
    setCurrentMagasin(null);
    setEditMagasinTitle("");
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    updateMagasin(magasin._id, { title: editMagasinTitle });
    setCurrentMagasin(null);
    setEditMagasinTitle("");
  };

  return (
    <ListGroup.Item className="d-flex align-items-center justify-content-between">
      {!isEditing ? (
        <>
          {/* Mode normal - affichage du titre avec lien */}
          <Link to={"/magasin/" + magasin._id} className="flex-grow-1 text-decoration-none text-dark">
            <div>
              <span className="list-group-item-title">{magasin.title}</span>
              <span className="text-small d-block text-muted">
                Modifié le <Moment format="DD/MM/YYYY">{magasin.updatedAt}</Moment>
              </span>
            </div>
          </Link>

          <div className="edit">
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                id="dropdown-basic"
              ></Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={handleEdit}>
                  Renommer
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
                value={editMagasinTitle}
                onChange={(e) => setEditMagasinTitle(e.target.value)}
                placeholder="Nom du magasin"
                autoFocus
                className="inline-edit-form__input"
              />
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
                onClick={handleCancelEdit}
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
