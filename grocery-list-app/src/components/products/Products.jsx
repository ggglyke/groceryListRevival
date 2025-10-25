import React from "react";
import { Form } from "react-bootstrap";

import useProducts from "./useProducts";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import EmptyProducts from "./EmptyProducts";
import Loader from "../ui/Loader";
import PageLayout from "../layout/PageLayout";

export default function Products({ userId }) {
  const {
    products,
    filteredProducts,
    aisles,
    isLoading,
    error,
    currentProduct,
    setCurrentProduct,
    sortBy,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteAllProducts,
    filterProducts,
    sortProducts,
  } = useProducts({ userId });

  if (!userId) return <Loader />;

  if (isLoading) return <Loader />;

  return (
    <PageLayout
      breadcrumbs={[{ label: "Produits", path: "/products" }]}
      title="Gérer vos produits"
      error={error}
    >
      {/* Formulaire de création toujours visible */}
      <ProductForm aisles={aisles} createProduct={createProduct} />

      {/* Liste des produits ou état vide */}
      {!products || products.length < 1 ? (
        <EmptyProducts />
      ) : (
        <>
          {/* Barre de recherche toujours visible si des produits existent */}
          <h5 className="mt-4">Tous vos produits ({products.length})</h5>
          <Form className="my-3">
            <Form.Group controlId="searchProduct">
              <Form.Label className="fw-bold">Cherche un produit :</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => filterProducts(e.target.value)}
                placeholder="Ex : chocolat"
              />
            </Form.Group>
          </Form>

          {filteredProducts.length > 0 ? (
            <ProductList
              products={filteredProducts}
              deleteProduct={deleteProduct}
              currentProduct={currentProduct}
              updateProduct={updateProduct}
              aisles={aisles}
              onEdit={setCurrentProduct}
              onCancelEdit={() => setCurrentProduct(null)}
              sortProducts={sortProducts}
              sortBy={sortBy}
              deleteAllProducts={deleteAllProducts}
            />
          ) : (
            <p className="text-muted">
              Aucun produit ne correspond à votre recherche.
            </p>
          )}
        </>
      )}
    </PageLayout>
  );
}
