import React from "react";
import { Link } from "react-router-dom";

import useAisles from "./useAisles";
import AisleForm from "./AisleForm";
import AisleList from "./AisleList";
import EmptyAisles from "./EmptyAisles";
import Loader from "../ui/Loader";

export default function Aisles({ userId }) {
  const {
    aisles,
    isLoading,
    error,
    currentAisle,
    setCurrentAisle,
    editAisleTitle,
    setEditAisleTitle,
    createAisle,
    updateAisle,
    deleteAisle,
    deleteAllAisles,
  } = useAisles({ userId });

  if (!userId) return <Loader />;

  // Condition pour afficher EmptyAisles
  const hasOnlyDefaultAisle = aisles.length === 1 && aisles[0]?.isDefault;
  const hasNoCustomAisles = aisles.length === 0 || hasOnlyDefaultAisle;

  return (
    <>
      {/* Breadcrumbs */}
      <div className="breadcrumbs mb-5">
        <div className="container">
          <div className="row">
            <div className="col py-2 text-muted">
              Accueil {">"} <Link to="/aisles">Rayons</Link>
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
              <h1 className="text-center fw-bold mt-3 mb-4">Rayons</h1>

              {/* Formulaire de création toujours visible */}
              <AisleForm createAisle={createAisle} />

              {/* Liste des rayons ou état vide */}
              {hasNoCustomAisles ? (
                <EmptyAisles />
              ) : (
                <AisleList
                  aisles={aisles}
                  deleteAisle={deleteAisle}
                  updateAisle={updateAisle}
                  deleteAllAisles={deleteAllAisles}
                  currentAisle={currentAisle}
                  setCurrentAisle={setCurrentAisle}
                  editAisleTitle={editAisleTitle}
                  setEditAisleTitle={setEditAisleTitle}
                />
              )}
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
}
