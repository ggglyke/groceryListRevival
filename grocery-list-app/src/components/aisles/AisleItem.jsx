import React from "react";
import { ListGroup, Dropdown, Form } from "react-bootstrap";
import { BsExclamationTriangle } from "react-icons/bs";
import TooltipComponent from "../reusable/tooltip.component";

export default function AisleItem({
  aisle,
  deleteAisle,
  updateAisle,
  currentAisle,
  setCurrentAisle,
  editAisleTitle,
  setEditAisleTitle,
}) {
  const isEditing = currentAisle?._id === aisle._id;

  const handleDelete = () => {
    if (
      window.confirm("Mer il é fou ! Voulez-vous vraiment supprimer ce rayon ?")
    ) {
      deleteAisle(aisle._id);
    }
  };

  const handleEdit = () => {
    setCurrentAisle(aisle);
    setEditAisleTitle(aisle.title);
  };

  const handleCancelEdit = () => {
    setCurrentAisle(null);
    setEditAisleTitle("");
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    updateAisle(aisle._id, { title: editAisleTitle });
  };

  return (
    <ListGroup.Item className="d-flex align-items-center justify-content-between">
      {!isEditing ? (
        <>
          {/* Mode normal - affichage du titre */}
          <div>
            {aisle.title}
            <br />
            {aisle.isDefault && (
              <span className="text-small text-muted">Rayon par défaut</span>
            )}
          </div>

          <div className="edit">
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                id="dropdown-basic"
              ></Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={handleEdit}>
                  Renommer
                  {aisle.isDefault && (
                    <TooltipComponent text="vous pouvez uniquement renommer le rayon par défaut, pas le supprimer" />
                  )}
                </Dropdown.Item>

                {!aisle.isDefault && (
                  <>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleDelete}>
                      <div className="text-danger d-flex align-items-center">
                        <BsExclamationTriangle className="me-1" />
                        Supprimer
                      </div>
                    </Dropdown.Item>
                  </>
                )}
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
                value={editAisleTitle}
                onChange={(e) => setEditAisleTitle(e.target.value)}
                placeholder="Nom du rayon"
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
