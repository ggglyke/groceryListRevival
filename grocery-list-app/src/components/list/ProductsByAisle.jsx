import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import ProductItem from "./ProductItem";
import "./ProductsByAisle.scss";

export default function ProductsByAisle({
  rayonList,
  list,
  dbProducts,
  onToggleCheck,
  onRenameProduct,
  onRemoveProduct,
  onAddProductToList,
}) {
  const checkedProducts = list?.checkedProducts || [];

  // Obtenir tous les produits (réguliers + customs)
  const allProducts = [
    ...(list?.products || []),
    ...(list?.customProducts || []),
  ];

  // Produits cochés (de tous les rayons)
  const checkedProductsList = allProducts
    .filter((p) => checkedProducts.includes(p._id))
    .sort((a, b) =>
      a.title.localeCompare(b.title, "fr", { sensitivity: "base" })
    );

  // Filtrer les produits non cochés dans chaque rayon
  const rayonsWithUncheckedProducts = rayonList
    .map((rayon) => ({
      ...rayon,
      products: rayon.products.filter((p) => !checkedProducts.includes(p._id)),
    }))
    .filter((rayon) => rayon.products.length > 0);

  // Suggestions : produits de la DB qui ne sont pas dans la liste
  // (peu importe s'ils sont cochés ou non)
  // Limité à 12 produits
  const suggestions = (dbProducts || [])
    .filter(
      (dbProduct) =>
        !list?.products?.some((p) => p._id === dbProduct._id) &&
        !list?.customProducts?.some((cp) => cp._id === dbProduct._id)
    )
    .sort((a, b) => (b.times_added || 0) - (a.times_added || 0))
    .slice(0, 12);

  return (
    <>
      {/* Produits non cochés par rayon - TOUJOURS VISIBLE EN HAUT */}
      {rayonsWithUncheckedProducts.length > 0 && (
        <div className="mb-4">
          <ul className="list-group">
            {rayonsWithUncheckedProducts.map((rayon) => (
              <React.Fragment key={rayon._id}>
                <li className="list-group-item py-2 fw-600 bg-light rayonTitle">
                  {rayon.title}
                </li>
                {rayon.products.map((product) => (
                  <ProductItem
                    key={product._id}
                    product={product}
                    isChecked={false}
                    isCustomProduct={
                      list?.customProducts?.some(
                        (cp) => cp._id === product._id
                      ) || false
                    }
                    onToggleCheck={onToggleCheck}
                    onRenameProduct={onRenameProduct}
                    onRemoveProduct={onRemoveProduct}
                  />
                ))}
              </React.Fragment>
            ))}
          </ul>
        </div>
      )}

      {/* Message si aucun produit dans la liste */}
      {allProducts.length === 0 && (
        <p className="text-muted text-center mt-4">
          Aucun produit dans cette liste
        </p>
      )}

      {/* Message si tous les produits sont cochés */}
      {allProducts.length > 0 &&
        rayonsWithUncheckedProducts.length === 0 &&
        checkedProductsList.length > 0 && (
          <p className="text-muted text-center mt-4 mb-4">
            Tout est coché ! Bravo, les courses sont terminées !
          </p>
        )}

      {/* Système d'onglets */}
      <Tabs defaultActiveKey="panier" className="mt-4 list-tabs">
        {/* Tab 1 : Produits dans le panier */}
        <Tab
          eventKey="panier"
          title="🛒 Produits dans le panier"
          className="list-tabs__tab"
        >
          <div className="mt-3">
            {checkedProductsList.length > 0 ? (
              <ul className="list-group">
                {checkedProductsList.map((product) => (
                  <ProductItem
                    key={product._id}
                    product={product}
                    isChecked={true}
                    isCustomProduct={
                      list?.customProducts?.some(
                        (cp) => cp._id === product._id
                      ) || false
                    }
                    onToggleCheck={onToggleCheck}
                    onRenameProduct={onRenameProduct}
                    onRemoveProduct={onRemoveProduct}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-muted text-center mt-4">
                Aucun produit dans le panier
              </p>
            )}
          </div>
        </Tab>

        {/* Tab 2 : Suggestions */}
        <Tab
          eventKey="suggestions"
          title="💡 Suggestions"
          className="list-tabs__tab"
        >
          <div className="mt-3">
            {suggestions.length > 0 ? (
              <ul className="list-group">
                {suggestions.map((product) => (
                  <li
                    key={product._id}
                    className="list-group-item py-2 d-flex justify-content-between align-items-center suggestion-item"
                    onClick={() => onAddProductToList(product._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex flex-column">
                      <span>{product.title}</span>
                      <span className="text-muted text-small">
                        {!product.times_added
                          ? "0 ajout"
                          : product.times_added === 1
                          ? "1 ajout"
                          : product.times_added + " ajouts"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted text-center mt-4">
                Aucune suggestion disponible
              </p>
            )}
          </div>
        </Tab>
      </Tabs>
    </>
  );
}
