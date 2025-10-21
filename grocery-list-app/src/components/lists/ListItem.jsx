import React from "react";

import { Link } from "react-router-dom";

import Moment from "react-moment";

export default function ListItem({ list }) {
  const count = (list.products.length || 0) + (list.customProducts.length || 0);
  return (
    <Link
      to={"/lists/" + list._id}
      className="list-group-item list-group-item-action"
    >
      <div>
        {list.title}
        <span className="text-small d-block text-muted">
          {count}
          {count > 1 ? " produits" : " produit"}
          {" - "}Modifiée le{" "}
          <Moment format="DD/MM/YYYY">{list.updatedAt}</Moment>
        </span>
      </div>
    </Link>
  );
}
