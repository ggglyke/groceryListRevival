import React from "react";
import { Link } from "react-router-dom";

import useProducts from "./useProducts";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import EmptyProducts from "./EmptyProducts";
import Loader from "../ui/Loader";

export default function Products({ userId }) {
  const {
    products,
    filteredProducts,
    aisles,
    isLoading,
    error,
    setCurrentProduct,
    sortBy,
    createProduct,
    deleteProduct,
    deleteAllProducts,
    filterProducts,
    sortProducts,
  } = useProducts({ userId });

  if (!userId) return <Loader />;

  return (
    <>
      {/* Breadcrumbs */}
      <div className="breadcrumbs mb-5">
        <div className="container">
          <div className="row">
            <div className="col py-2 text-muted">
              Accueil {">"} <Link to="/products">Produits</Link>
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
              <h1 className="text-center fw-bold mt-3 mb-4">
                Gérer vos produits
              </h1>

              {/* Formulaire de création toujours visible */}
              <h5 className="mt-4">Ajouter un nouveau produit</h5>
              <ProductForm aisles={aisles} createProduct={createProduct} />

              {/* Liste des produits ou état vide */}
              {!products || products.length < 1 ? (
                <EmptyProducts />
              ) : filteredProducts.length > 0 ? (
                <ProductList
                  products={filteredProducts}
                  deleteProduct={deleteProduct}
                  onEdit={setCurrentProduct}
                  filterProducts={filterProducts}
                  sortProducts={sortProducts}
                  sortBy={sortBy}
                  deleteAllProducts={deleteAllProducts}
                />
              ) : (
                <p className="text-muted">
                  Aucun produit ne correspond à votre recherche.
                </p>
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
