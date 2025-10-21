/* React */
import React from "react";

import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";

/* hook */
import useLists from "./useLists";

/* own components */
import ListItem from "./ListItem";
import EmptyLists from "./EmptyLists";
import Loader from "../ui/Loader";
import TooltipComponent from "../reusable/tooltip.component";

/* data */

export default function Lists({ userId }) {
  const { lists, isLoading, error, createList } = useLists({ userId });

  if (!userId) return <Loader />;

  return (
    <>
      <div className="breadcrumbs mb-5">
        <div className="container">
          <div className="row">
            <div className="col py-2 text-muted">
              Accueil {">"} <Link to="./lists">Listes</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {!isLoading ? (
          <>
            {lists.length > 0 ? (
              <div className="row d-flex justify-content-center">
                <div className="col-sm-12 col-md-8 col-lg-6 mt-5 list-container px-5 py-4 d-flex flex-column">
                  <div className="d-flex justify-content-between mb-4">
                    <h1>Toutes vos listes</h1>
                    <button
                      onClick={createList}
                      className="btn btn-primary align-self-start"
                    >
                      Ajouter
                    </button>
                    <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Créer une liste
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">
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
                        <Dropdown.Item href="#/action-2">
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
                  <div className="list-group">
                    {lists.map((list) => (
                      <ListItem key={list._id} list={list} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <EmptyLists createList={createList} />
            )}
          </>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
}
