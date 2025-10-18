/* React */
import React from "react";
import { useReducer, useState, useEffect } from "react";

/* react-bootstrap */
import Dropdown from "react-bootstrap/Dropdown";

/* react-router-dom */

/* other libraries */

/* services */

/* reducers */
import productReducer from "../reducers/productReducer";

/* own components */
import Breadcrumbs from "./reusable/breadcrumbs.component";
import ListGroup from "./reusable/listGroup.component";
import AddProductForm from "./reusable/addProductForm.component";

/* scss */
import "../scss/main.scss";

/* data */
import initialProducts from "../data/products.data";
import rayonsData from "../data/rayons.data";

const breadcrumbsData = [
  {
    title: "Listes",
    link: "/lists",
  },
  {
    title: "liste de test",
  },
];

export default function ListTest() {
  const [products, dispatch] = useReducer(productReducer, initialProducts);
  const [productsWithAisles, setProductsWithAisles] = useState([]);
  const [filteredRayons, setFilteredRayons] = useState([]);

  useEffect(() => {
    const mapAislesToProducts = () => {
      const updatedProducts = initialProducts.map((product) => {
        const aisle = rayonsData.find((aisle) => aisle.id === product.rayon);
        return { ...product, rayonName: aisle ? aisle.title : "Inconnu" };
      });
      setProductsWithAisles(updatedProducts);

      const productRayons = updatedProducts.map((product) => product.rayon);
      const uniqueRayons = [...new Set(productRayons)];
      const filteredRayons = rayonsData.filter((rayon) =>
        uniqueRayons.includes(rayon.id)
      );
      setFilteredRayons(filteredRayons);
    };

    // Vérifier que nous avons à la fois des produits et des rayons
    if (products.length > 0 && rayonsData.length > 0) {
      mapAislesToProducts();
    }
  }, [products, rayonsData]);

  let nextId = initialProducts.reduce((max, product) => {
    return product.rayon > max ? product.rayon : max;
  }, 0);

  function handleAddProduct(product) {
    dispatch({
      type: "added",
      rayon: nextId++,
      product: product,
    });
  }

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbsData} />
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-sm-12 col-md-8 col-lg-6 mt-5 list-container px-5 py-4 d-flex flex-column">
            <div className="d-flex justify-content-between">
              <h1 className="editH1">Liste du 05/12/2023 21:46:24</h1>
              <Dropdown>
                <Dropdown.Toggle
                  variant="outline-secondary"
                  id="dropdown-basic"
                >
                  <p>Edit</p>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick="">
                    Supprimer les produits cochés
                  </Dropdown.Item>

                  <Dropdown.Item onClick="">Renommer</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick="">
                    <div className="text-danger d-flex align-items-center">
                      Supprimer la liste
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <>
              <AddProductForm
                onAddProduct={handleAddProduct}
                placeholder="Ex : bananes"
                rayons={rayonsData}
              />
              <ListGroup
                products={productsWithAisles}
                filteredRayons={filteredRayons}
              />
            </>
          </div>
        </div>
      </div>
    </>
  );
}
