import React from "react";
import { Link, useParams } from "react-router-dom";

import useMagasin from "./useMagasin";
import AisleOrderList from "./AisleOrderList";
import Loader from "../ui/Loader";

export default function Magasin({ userId }) {
  const { id } = useParams();
  const { magasin, aisles, isLoading, error, updateAisleOrder } = useMagasin({
    magasinId: id,
    userId,
  });

  const handleDragEnd = (result) => {
    // Si pas de destination (dropped outside), on ne fait rien
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // Si même position, on ne fait rien
    if (sourceIndex === destinationIndex) return;

    // Créer le nouveau tableau d'IDs dans le bon ordre
    const aisleIds = aisles.map((aisle) => aisle._id);
    const [movedId] = aisleIds.splice(sourceIndex, 1);
    aisleIds.splice(destinationIndex, 0, movedId);

    // Sauvegarder le nouvel ordre
    updateAisleOrder(aisleIds);
  };

  if (!userId) return <Loader />;

  return (
    <>
      {/* Breadcrumbs */}
      <div className="breadcrumbs mb-5">
        <div className="container">
          <div className="row">
            <div className="col py-2 text-muted">
              Accueil {">"} <Link to="/magasins">Magasins</Link> {">"}{" "}
              {magasin?.title || "Chargement..."}
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
            <div className="col-sm-12 col-md-8 col-lg-6 mt-5 list-container px-5 py-4 d-flex flex-column">
              <h1 className="mb-4">{magasin?.title}</h1>

              <AisleOrderList aisles={aisles} onDragEnd={handleDragEnd} />
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
}
