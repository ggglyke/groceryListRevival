import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaBars } from "react-icons/fa";

export default function AisleOrderList({ aisles, onDragEnd }) {
  return (
    <div>
      <p className="text-small">
        Changez l'ordre des rayons grâce au glisser-déposer. L'ordre des rayons
        détermine l'ordre d'affichage des produits dans vos listes.
      </p>
      <p>Liste des rayons :</p>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-1">
          {(provided) => (
            <ul
              className="list-group"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {aisles && aisles.length > 0 ? (
                aisles.map((aisle, index) => (
                  <Draggable
                    key={aisle._id}
                    draggableId={"draggable-" + aisle._id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <li
                        className="list-group-item d-flex justify-content-between align-items-center"
                        style={{ transition: "all 0.2s ease" }}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        {aisle.title}
                        <div {...provided.dragHandleProps}>
                          <FaBars className="text-muted" />
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))
              ) : (
                <li className="list-group-item text-muted">
                  Aucun rayon trouvé
                </li>
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
