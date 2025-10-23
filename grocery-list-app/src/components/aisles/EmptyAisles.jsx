import React from "react";

import EmptyState from "../ui/EmptyState";

export default function EmptyAisles({ createAisle }) {
  return (
    <div className="row d-flex justify-content-center">
      <div className="col-sm-12 col-md-8 col-lg-6 d-flex flex-column">
        <div className="empty-state d-flex flex-column align-items-center">
          <EmptyState />

          <h1 className="mt-5">
            C'est bien vide par ici. Le rayon par défaut se sent bien seul
          </h1>
          <p>Et si on commençait par ajouter un rayon</p>
        </div>
      </div>
    </div>
  );
}
