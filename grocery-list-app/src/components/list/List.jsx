import React from "react";
import { useParams, Navigate } from "react-router-dom";
import useList from "./useList";
import Loader from "../ui/Loader";

export default function List({ userId }) {
  const { id } = useParams();
  const {
    list,
    aisles,
    dbProducts,
    magasins,
    productsToDisplay,
    rayonList,
    isLoading,
    error,
    listDeleted,
  } = useList({ listId: id, userId });

  if (!userId) return <Loader />;
  if (listDeleted) return <Navigate to="/lists" replace={true} />;

  return (
    <>
      {/* Breadcrumbs */}
      <div className="breadcrumbs mb-5">
        <div className="container">
          <div className="row">
            <div className="col py-2 text-muted">
              Accueil {">"} <a href="/lists">Listes</a> {">"}{" "}
              {list?.title || "Chargement..."}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {!isLoading ? (
          <div className="row d-flex justify-content-center">
            <div className="col-sm-12 col-md-8 col-lg-6 list-container px-5 pt-4 pb-5">
              <h1>{list?.title}</h1>

              {/* DEBUG: Affichage des données chargées */}
              <div className="mt-4">
                <h5>📊 Debug - Données chargées :</h5>
                <ul>
                  <li>
                    Liste : {list?.title} (ID: {list?._id})
                  </li>
                  <li>Magasin : {list?.magasin?.title || "N/A"}</li>
                  <li>Nombre de rayons : {aisles.length}</li>
                  <li>Nombre de produits dans la BDD : {dbProducts.length}</li>
                  <li>Nombre de magasins : {magasins.length}</li>
                  <li>Produits dans la liste : {productsToDisplay.length}</li>
                  <li>Rayons avec produits : {rayonList.length}</li>
                </ul>

                {/* Afficher les produits groupés par rayon */}
                {rayonList.length > 0 && (
                  <div className="mt-4">
                    <h5>🛒 Produits par rayon :</h5>
                    {rayonList.map((rayon) => (
                      <div key={rayon._id} className="mb-3">
                        <h6 className="fw-bold">{rayon.title}</h6>
                        <ul>
                          {rayon.products.map((item, idx) => (
                            <li key={idx}>
                              {item.title || "Produit sans nom"}
                              {item.customName && ` (${item.customName})`}-
                              Quantité: {item.quantity || 1}
                              {item.checked && " ✓"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {productsToDisplay.length === 0 && (
                  <p className="text-muted mt-3">
                    Aucun produit dans cette liste
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
}
