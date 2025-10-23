import React from "react";
import { ListGroup } from "react-bootstrap";
import AisleItem from "./AisleItem";

export default function AisleList({
  aisles,
  deleteAisle,
  updateAisle,
  deleteAllAisles,
  currentAisle,
  setCurrentAisle,
  editAisleTitle,
  setEditAisleTitle,
}) {
  return (
    <>
      <h5 className="mt-4">Tous les rayons</h5>

      <ListGroup>
        {aisles.map((aisle) => (
          <AisleItem
            key={aisle._id}
            aisle={aisle}
            deleteAisle={deleteAisle}
            updateAisle={updateAisle}
            currentAisle={currentAisle}
            setCurrentAisle={setCurrentAisle}
            editAisleTitle={editAisleTitle}
            setEditAisleTitle={setEditAisleTitle}
          />
        ))}
      </ListGroup>

      <button
        className="btn mt-4 btn-outline-danger"
        onClick={() => {
          if (
            window.confirm(
              "Mer il é fou ! Voulez-vous vraiment supprimer tous les rayons ?"
            )
          ) {
            deleteAllAisles();
          }
        }}
      >
        Supprimer tous les rayons
      </button>
    </>
  );
}
