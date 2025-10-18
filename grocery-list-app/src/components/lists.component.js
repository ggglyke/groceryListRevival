/* React */
import React, { useState, useEffect, useCallback } from "react";

/* react-bootstrap */
import Dropdown from "react-bootstrap/Dropdown";

/* react-router-dom */
import { Navigate, Link } from "react-router-dom";

/* other libraries */
import Moment from "react-moment";

/* services */
import ListDataService from "../services/list.service";
import MagasinDataService from "../services/magasin.service";

/* reducers */

/* own components */
import EmptyState from "./reusable/empty-state.component";
import Loader from "./reusable/loader.component";
import TooltipComponent from "./reusable/tooltip.component";

/* scss */
import "../scss/main.scss";

/* data */

export default function Lists({ userId }) {
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [redirect, setRedirect] = useState(null);

  const retrieveLists = useCallback(async (userId) => {
    try {
      const response = await ListDataService.getAllUserLists(userId);
      const lists = Array.isArray(response.data) ? response.data : [];
      const ordered = [...lists].sort((a, b) => {
        const da = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const db = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return db - da;
      });
      setLists(ordered);
      setIsLoading(false);
    } catch (e) {
      console.error("retrieveLists error : ", e);
      setIsLoading(false);
    }
  }, []);

  const createNewList = async (e) => {
    e.preventDefault();
    try {
      if (!userId) return;

      const d = new Date();
      const date = d.toLocaleString("fr-FR");
      let data = {
        user: userId,
        title: "Liste du " + date,
      };

      try {
        const resp = await MagasinDataService.findOneByCondition({
          default: true,
          user: userId,
        });
        if (resp?.data?._id) {
          data.magasin = resp.data._id;
        }
      } catch {
        console.error("pas de magasin par défaut, on continue  ");
      }

      const result = await ListDataService.create(data);

      if (result?.data?.list?._id) {
        setRedirect(result.data.list._id);
      } else if (result?.data?._id) {
        setRedirect(result.data._id);
      }
    } catch (e) {
      console.error("createNewList error : ", e);
    }
  };

  useEffect(() => {
    if (userId) {
      retrieveLists(userId);
    }
  }, [userId, retrieveLists]);

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
        {redirect && <Navigate to={"/lists/" + redirect} replace />}
        {!isLoading ? (
          <>
            {lists.length > 0 ? (
              <div className="row d-flex justify-content-center">
                <div className="col-sm-12 col-md-8 col-lg-6 mt-5 list-container px-5 py-4 d-flex flex-column">
                  <div className="d-flex justify-content-between mb-4">
                    <h1>Toutes vos listes</h1>
                    <button
                      onClick={createNewList}
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
                    {lists &&
                      lists.map((list, index) => {
                        const count =
                          (list.products.length || 0) +
                          (list.customProducts?.length || 0);
                        return (
                          <Link
                            to={"/lists/" + list._id}
                            className="list-group-item list-group-item-action "
                            key={list._id}
                          >
                            <div>
                              {list.title}
                              <span className="text-small d-block text-muted">
                                {count}
                                {count > 1 ? " produits" : " produit"}
                                {" - "}Modifiée le{" "}
                                <Moment format="DD/MM/YYYY">
                                  {list.updatedAt}
                                </Moment>
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="row d-flex justify-content-center">
                <div className="col-sm-12 col-md-8 col-lg-6 d-flex flex-column">
                  <div className="empty-state d-flex flex-column align-items-center">
                    <EmptyState />

                    <h1 className="mt-5">C'est bien vide par ici.</h1>
                    <p>Et si on commençait par...</p>
                    <button onClick={createNewList} className="btn btn-primary">
                      Ajouter une liste
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
}
