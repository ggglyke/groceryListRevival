/* React */
import React from "react";
import { Link } from "react-router-dom";

/* hook */
import useMagasins from "./useMagasins";

/* own components */
import MagasinItem from "./MagasinItem";
import EmptyMagasins from "./EmptyMagasins";
import Loader from "../ui/Loader";

export default function Magasins({ userId }) {
  const { magasins, isLoading, error, createMagasin } = useMagasins({ userId });

  if (!userId) return <Loader />;
  return (
    <>
      {/* Breadcrumbs */}
      <div className="breadcrumbs mb-5">
        <div className="container">
          <div className="row">
            <div className="col py-2 text-muted">
              Accueil {">"} <Link to="./magasins">Magasins</Link>
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
          <>
            {magasins.length > 0 ? (
              <div className="row d-flex justify-content-center">
                <div className="col-sm-12 col-md-8 col-lg-6 mt-5 list-container px-5 py-4 d-flex flex-column">
                  <div className="d-flex justify-content-between mb-4">
                    <h1>Vos magasins</h1>
                    <button
                      onClick={createMagasin}
                      className="btn btn-primary align-self-start"
                    >
                      Ajouter
                    </button>
                  </div>
                  <div className="list-group">
                    {magasins.map((magasin) => (
                      <MagasinItem key={magasin._id} magasin={magasin} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <EmptyMagasins createMagasin={createMagasin} />
            )}
          </>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
}
