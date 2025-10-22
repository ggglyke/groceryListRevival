import React from "react";
import { ListGroup, Form } from "react-bootstrap";
import { FaSortUp, FaSort, FaSortDown } from "react-icons/fa";
import ProductItem from "./ProductItem";

export default function ProductList({
  products,
  deleteProduct,
  onEdit,
  filterProducts,
  sortProducts,
  sortBy,
  deleteAllProducts,
}) {
  return (
    <>
      <h5 className="mt-4">Tous vos produits ({products.length})</h5>
      <Form className="my-3">
        <Form.Group controlId="searchProduct">
          <Form.Label className="fw-bold">Cherche un produit :</Form.Label>
          <Form.Control
            type="text"
            onChange={(e) => filterProducts(e.target.value)}
            placeholder="Ex : chocolat"
          ></Form.Control>
        </Form.Group>
      </Form>
      <div className="sorting d-flex justify-content-between text-small my-2">
        <div
          className="sortItem d-flex align-items-center"
          onClick={() => sortProducts(products, "productName")}
        >
          {!sortBy.includes("productName") ? (
            <>
              Produit A-Z
              <FaSort className="ms-1 text-muted" />
            </>
          ) : sortBy === "productName_AZ" ? (
            <>
              Produit A-Z
              <FaSortDown className="ms-1 align-self-center" />
            </>
          ) : (
            <>
              Produit Z-A
              <FaSortUp className="ms-1 align-self-end" />
            </>
          )}
        </div>
        <div
          className="sortItem d-flex align-items-center"
          onClick={() => sortProducts(products, "aisleName")}
        >
          {!sortBy.includes("aisleName") ? (
            <>
              Rayon A-Z
              <FaSort className="ms-1 text-muted" />
            </>
          ) : sortBy === "aisleName_AZ" ? (
            <>
              Rayon A-Z
              <FaSortDown className="ms-1 align-self-center" />
            </>
          ) : (
            <>
              Rayon Z-A
              <FaSortUp className="ms-1 align-self-end" />
            </>
          )}
        </div>
        <div
          className="sortItem d-flex align-items-center"
          onClick={() => sortProducts(products, "timesAdded")}
        >
          {!sortBy.includes("timesAdded") ? (
            <>
              Nb ajouts +/-
              <FaSort className="ms-1 text-muted" />
            </>
          ) : sortBy === "timesAdded_ascend" ? (
            <>
              Nb ajouts +/-
              <FaSortDown className="ms-1 align-self-center" />
            </>
          ) : (
            <>
              Nb ajouts -/+
              <FaSortUp className="ms-1 align-self-end" />
            </>
          )}
        </div>
      </div>

      <ListGroup>
        {products.map((product) => (
          <ProductItem
            key={product._id}
            product={product}
            deleteProduct={deleteProduct}
            onEdit={onEdit}
          />
        ))}
      </ListGroup>
      <button
        className="btn mt-4 btn-outline-danger"
        onClick={() => {
          if (
            window.confirm(
              "Mer il é fou ! Voulez-vous vraiment supprimer tous les produits ?"
            )
          ) {
            deleteAllProducts();
          }
        }}
      >
        Supprimer tous les produits
      </button>
    </>
  );
}
