import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

import EmptyState from "../ui/EmptyState";
import TooltipComponent from "../reusable/tooltip.component";

export default function EmptyLists({ createList }) {
  return (
    <div className="row d-flex justify-content-center">
      <div className="col-sm-12 col-md-8 col-lg-6 d-flex flex-column">
        <div className="empty-state d-flex flex-column align-items-center">
          <EmptyState />

          <h1 className="mt-5">C'est bien vide par ici.</h1>
          <p>Et si on commençait par...</p>
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              Créer une liste
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => createList(false)}>
                Liste simple
                <TooltipComponent
                  config={{ size: ".75em" }}
                  text={[
                    "Des éléments à cocher, c'est tout.",
                    <br />,
                    " Idéal pour une TODO list.",
                  ]}
                />
              </Dropdown.Item>
              <Dropdown.Item onClick={() => createList(true)}>
                Liste avancée
                <TooltipComponent
                  config={{ size: ".75em" }}
                  text={[
                    "Une liste que vous attribuez à un magasin, avec des rayons dans un ordre que vous définissez. ",
                    <br />,
                    " Idéal pour une liste de courses.",
                  ]}
                />
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
