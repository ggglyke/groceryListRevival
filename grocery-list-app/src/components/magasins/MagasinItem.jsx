import React from "react";

import { Link } from "react-router-dom";

import Moment from "react-moment";

export default function MagasinItem({ magasin }) {
  return (
    <Link
      to={"/magasin/" + magasin._id}
      className="list-group-item list-group-item-action"
    >
      <div>
        <span className="list-group-item-title">{magasin.title}</span>
        <span className="text-small d-block text-muted">
          Modifié le <Moment format="DD/MM/YYYY">{magasin.updatedAt}</Moment>
        </span>
      </div>
    </Link>
  );
}
