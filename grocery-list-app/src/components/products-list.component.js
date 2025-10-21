import React, { Component } from "react";
import ProductDataService from "../services/product.service";
import AisleDataService from "../services/aisle.service";
import { FaSortUp, FaSort, FaSortDown } from "react-icons/fa";
import { BsExclamationTriangle } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";

import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";

import "../scss/main.scss";
import EmptyState from "./ui/EmptyState";
import Loader from "./ui/Loader";

export default class ProductsList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.onChangeEditProductTitle = this.onChangeEditProductTitle.bind(this);
    this.retrieveProducts = this.retrieveProducts.bind(this);
    this.retrieveAisles = this.retrieveAisles.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveProduct = this.setActiveProduct.bind(this);
    this.editActiveProduct = this.editActiveProduct.bind(this);
    this.removeAllProducts = this.removeAllProducts.bind(this);
    this.searchTitle = this.searchTitle.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.saveProduct = this.saveProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.onChangeEditProductAisle = this.onChangeEditProductAisle.bind(this);
    this.onChangeNewProductTitle = this.onChangeNewProductTitle.bind(this);
    this.onChangefilterString = this.onChangefilterString.bind(this);
    this.onChangeNewProductAisle = this.onChangeNewProductAisle.bind(this);
    this.sortProductsBy = this.sortProductsBy.bind(this);

    this.state = {
      isLoading: true,
      products: [],
      filteredProducts: [],
      rayons: [],
      currentProduct: null,
      currentIndex: -1,
      searchTitle: "",
      edit: false,
      newProductTitle: "",
      newProductAisle: "",
      editProductTitle: "",
      editProductId: "",
      sort: "timesAdded_90",
      user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : false,
    };
  }
  componentDidMount() {
    document.title = `Liste globale des produits" + " - " + ${process.env.REACT_APP_APP_NAME}`;
    this.state.user && this.retrieveProducts();
    this.state.user && this.retrieveAisles();
  }

  sortProductsBy(sortKey) {
    console.log(sortKey);
    const products = this.state.products;
    var new_products = [];
    if (sortKey === "productName") {
      if (this.state.sort !== "productName_AZ") {
        new_products = products.sort((a, b) => a.title.localeCompare(b.title));
        this.setState({
          ...this.state,
          sort: "productName_AZ",
        });
      } else {
        new_products = products
          .sort((a, b) => a.title.localeCompare(b.title))
          .reverse();
        this.setState({
          ...this.state,
          sort: "productName_ZA",
        });
      }
    } else if (sortKey === "aisleName") {
      if (this.state.sort !== "aisleName_AZ") {
        new_products = products.sort((a, b) =>
          a.rayon.title.localeCompare(b.rayon.title)
        );
        this.setState({
          ...this.state,
          sort: "aisleName_AZ",
        });
      } else {
        new_products = products
          .sort((a, b) => a.rayon.title.localeCompare(b.rayon.title))
          .reverse();
        this.setState({
          ...this.state,
          sort: "aisleName_ZA",
        });
      }
    } else if (sortKey === "timesAdded") {
      if (this.state.sort !== "timesAdded_90") {
        new_products = products.sort((a, b) => a.times_added - b.times_added);
        this.setState({
          ...this.state,
          sort: "timesAdded_90",
        });
      } else {
        new_products = products
          .sort((a, b) => a.times_added - b.times_added)
          .reverse();
        this.setState({
          ...this.state,
          sort: "timesAdded_09",
        });
      }
    }
    this.setState({
      products: new_products,
      productsLoaded: true,
    });
  }

  componentDidUpdate() {
    const { rayonsLoaded, isLoading, productsLoaded } = this.state;
    if (isLoading && rayonsLoaded && productsLoaded) {
      this.setState({ isLoading: false });
    }
  }

  // retrieve products & rayons
  retrieveAisles() {
    AisleDataService.getAllUserAisles(this.state.user._id)
      .then((response) => {
        this.setState({
          rayons: response.data,
          rayonsLoaded: true,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  retrieveProducts() {
    ProductDataService.getAllUserProducts(this.state.user._id)
      .then((response) => {
        var products = response.data.sort(
          (a, b) =>
            a.rayon && b.rayon && a.rayon.title.localeCompare(b.rayon.title)
        );
        products.map((product) => {
          if (!product.times_added) {
            return (product.times_added = 0);
          } else {
            return true;
          }
        });

        this.setState(
          {
            products: products,
            filteredProducts: products,
          },
          () => this.sortProductsBy("timesAdded")
        );
      })
      .catch((e) => {
        console.log(e);
      });
  }

  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle,
    });
  }

  editActiveProduct(e) {
    if (!this.state.edit) {
      this.setState({
        editProductTitle: e.target.getAttribute("data-aisle-title"),
        editProductId: e.target.getAttribute("data-aisle-id"),
        edit: true,
      });
    } else {
      this.setState({
        currentProduct: null,
        edit: false,
      });
    }
  }

  // new Product
  onChangeNewProductTitle(e) {
    this.setState({
      newProductTitle: e.target.value,
    });
  }

  onChangeNewProductAisle(e) {
    this.setState({ newProductAisle: e.target.value });
  }

  onChangefilterString(e) {
    this.setState({
      filterString: e.target.value,
    });
    var products = this.state.products.filter((f) =>
      f.title.toLowerCase().includes(e.target.value.toLowerCase())
    );

    this.setState({
      filteredProducts: products,
    });
  }

  saveProduct(e) {
    if (this.state.user) {
      e.preventDefault();
      var data = {
        user: this.state.user._id,
        title: this.state.newProductTitle,
        rayon: this.state.newProductAisle,
        times_added: 0,
      };

      ProductDataService.create(data)
        .then((response) => {
          console.log("rep", response);
          if (response.data.created === true) {
            toast.success("Produit créé avec succès ! 👌", {
              position: "top-right",
            });
            this.setState(
              {
                id: response.data.id,
                title: response.data.title,
                aisle: response.data.rayon,
                newProductTitle: "",
                newProductAisle: "",
                currentProduct: null,
              },
              () => {
                this.retrieveProducts();
              }
            );
          } else {
            toast.error(response.data.message, {
              position: "top-right",
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      console.error("no user found");
    }
  }

  // edit product
  onChangeEditProductTitle(e) {
    this.setState({
      editProductTitle: e.target.value,
    });
  }

  onChangeEditProductAisle(e) {
    this.setState({ editedAisleId: e.target.value });
  }

  updateProduct(e) {
    e.preventDefault();
    var id = this.state.editProductId;
    var data = {
      title: this.state.editProductTitle,
      rayon: this.state.editedAisleId,
    };

    ProductDataService.update(id, data)
      .then((response) => {
        this.setState(
          {
            id: response.data.id,
            title: response.data.title,
            currentProduct: null,
            edit: false,
          },
          () => {
            toast.success("Produit mis à jour ! 👌", {
              position: "top-right",
            });
            this.retrieveProducts();
          }
        );
      })
      .catch((e) => {
        console.log(e);
      });
  }

  deleteProduct(e) {
    e.preventDefault();
    var confirm = window.confirm("Voulez-vous vraiment supprimer ce produit ?");
    if (confirm === true) {
      var id = e.target.getAttribute("data-product-id");
      ProductDataService.delete(id)
        .then((response) => {
          this.setState(this.baseState, this.retrieveProducts());
        })
        .catch((e) => {
          console.log("e");
        });
    }
  }

  refreshList() {
    this.retrieveProducts();
    this.setState({
      currentProduct: null,
      currentIndex: -1,
    });
  }

  setActiveProduct(product) {
    this.setState({
      currentProduct: product,
      editedAisleId: product.rayon._id,
      editProductTitle: product.title,
      editProductId: product._id,
      edit: true,
    });
  }

  removeAllProducts() {
    var confirm = window.confirm(
      "Mer il é fou ! Voulez-vous vraiment supprimer tous les produits ?"
    );
    if (confirm === true) {
      ProductDataService.deleteAll()
        .then((response) => {
          console.log(response.data);
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  searchTitle() {
    ProductDataService.findByTitle(this.state.searchTitle)
      .then((response) => {
        this.setState({
          products: response.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const {
      filteredProducts,
      currentProduct,
      edit,
      currentIndex,
      editProductTitle,
      isLoading,
      products,
    } = this.state;

    return (
      <>
        <div className="breadcrumbs mb-5">
          <div className="container">
            <div className="row">
              <div className="col py-2 text-muted">
                Accueil {">"} <a href="./produits">Produits</a>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          {!isLoading ? (
            <>
              <div className="row d-flex justify-content-center">
                <div className="col-sm-12 col-md-8 col-lg-6 mt-5 list-container px-5 py-4 d-flex flex-column">
                  <h1 className="text-center fw-bold mt-3 mb-4">
                    Gérer vos produits
                  </h1>
                  <h5 className="mt-4">Ajouter un nouveau produit</h5>
                  <Form onSubmit={this.saveProduct} className="my-3">
                    <Form.Group controlId="newProductTitle" className="mb-3">
                      <Form.Label>Nom du nouveau produit :</Form.Label>
                      <Form.Control
                        type="text"
                        required
                        value={this.state.newProductTitle}
                        onChange={this.onChangeNewProductTitle}
                        placeholder="Ex : carottes"
                      ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="newProductAisle" className="mb-3">
                      <Form.Label>Rayon :</Form.Label>
                      <Form.Select
                        onChange={this.onChangeNewProductAisle}
                        value={this.state.newProductAisle}
                      >
                        <option>Choisir un rayon</option>
                        {this.state.rayons
                          .sort((a, b) => a.title.localeCompare(b.title))
                          .map((aisle) => (
                            <option key={aisle._id} value={aisle._id}>
                              {aisle.title}
                            </option>
                          ))}
                      </Form.Select>
                    </Form.Group>
                    <div className="d-grid">
                      <input
                        className="btn btn-primary mt-2"
                        type="submit"
                        value="Ajouter le produit"
                      />
                    </div>
                  </Form>
                  {!products ||
                    (products.length < 1 ? (
                      <div className="empty-state d-flex flex-column align-items-center mt-2">
                        <EmptyState />

                        <h1 className="mt-5">C'est bien vide par ici.</h1>
                        <p>Et si on commençait par créer un produit ?...</p>
                      </div>
                    ) : (
                      <>
                        <h5 className="mt-4">
                          Tous vos produits ({filteredProducts.length})
                        </h5>
                        <Form className="my-3">
                          <Form.Group controlId="searchProduct">
                            <Form.Label className="fw-bold">
                              Cherche un produit :
                            </Form.Label>
                            <Form.Control
                              type="text"
                              required
                              value={this.state.filterString}
                              onChange={this.onChangefilterString}
                              placeholder="Ex : chocolat"
                            ></Form.Control>
                          </Form.Group>
                        </Form>
                        <div className="sorting d-flex justify-content-between text-small my-2">
                          <div
                            className="sortItem d-flex align-items-center"
                            onClick={() => this.sortProductsBy("productName")}
                          >
                            {!this.state.sort.includes("productName") ? (
                              <>
                                Produit A-Z
                                <FaSort className="ms-1 text-muted" />
                              </>
                            ) : this.state.sort === "productName_AZ" ? (
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
                            onClick={() => this.sortProductsBy("aisleName")}
                          >
                            {!this.state.sort.includes("aisleName") ? (
                              <>
                                Rayon A-Z
                                <FaSort className="ms-1 text-muted" />
                              </>
                            ) : this.state.sort === "aisleName_AZ" ? (
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
                            onClick={() => this.sortProductsBy("timesAdded")}
                          >
                            {!this.state.sort.includes("timesAdded") ? (
                              <>
                                Nb ajouts +/-
                                <FaSort className="ms-1 text-muted" />
                              </>
                            ) : this.state.sort === "timesAdded_09" ? (
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
                          {filteredProducts &&
                            filteredProducts.map((product, index) => (
                              <ListGroupItem
                                className={
                                  "d-flex align-items-start flex-column " +
                                  (index === currentIndex ? " active" : "")
                                }
                                /*onClick={() =>
                                  //this.setActiveProduct(product, index)
                                }*/
                                key={index}
                              >
                                <div className="d-flex align-self-stretch justify-content-between">
                                  <div className="d-flex flex-column">
                                    {product.title}
                                    <div className="text-muted text-small">
                                      {product.rayon && (
                                        <span>
                                          {product.rayon.title}
                                          {" - "}
                                        </span>
                                      )}
                                      <span>
                                        {!product.times_added
                                          ? "0 ajout"
                                          : product.times_added === 1
                                          ? "1 ajout"
                                          : product.times_added + " ajouts"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="edit">
                                    <Dropdown>
                                      <Dropdown.Toggle
                                        variant="outline-secondary"
                                        id="dropdown-basic"
                                      ></Dropdown.Toggle>

                                      <Dropdown.Menu>
                                        <Dropdown.Item
                                          onClick={(e) =>
                                            this.setActiveProduct(product)
                                          }
                                        >
                                          Modifier
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item
                                          onClick={this.deleteProduct}
                                          data-product-id={product._id}
                                        >
                                          <div
                                            className="text-danger d-flex align-items-center"
                                            data-product-id={product._id}
                                          >
                                            <BsExclamationTriangle className="me-1" />
                                            Supprimer
                                          </div>
                                        </Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </div>
                                </div>
                                {currentProduct &&
                                  currentProduct._id === product._id && (
                                    <div className="asideEdit align-self-stretch mt-3">
                                      <div>
                                        {edit && (
                                          <Form onSubmit={this.updateProduct}>
                                            <Form.Group
                                              controlId="editProductTitle"
                                              className="mb-3"
                                            >
                                              <Form.Label className="fw-bold">
                                                Nom :
                                              </Form.Label>
                                              <Form.Control
                                                type="text"
                                                required
                                                value={editProductTitle}
                                                onChange={
                                                  this.onChangeEditProductTitle
                                                }
                                              ></Form.Control>
                                            </Form.Group>
                                            <Form.Group
                                              controlId="editProductAisle"
                                              className="mb-4"
                                            >
                                              <Form.Label className="fw-bold">
                                                Rayon :
                                              </Form.Label>
                                              <Form.Select
                                                onChange={
                                                  this.onChangeEditProductAisle
                                                }
                                                value={this.state.editedAisleId}
                                              >
                                                <option>
                                                  Choisir un rayon
                                                </option>
                                                {this.state.rayons
                                                  .sort((a, b) =>
                                                    a.title.localeCompare(
                                                      b.title
                                                    )
                                                  )
                                                  .map((aisle) => (
                                                    <option
                                                      key={aisle._id}
                                                      value={aisle._id}
                                                    >
                                                      {aisle.title}
                                                    </option>
                                                  ))}
                                              </Form.Select>
                                            </Form.Group>
                                            <div>
                                              <button
                                                type="button"
                                                className="btn btn-outline-secondary me-3"
                                                data-aisle-id={
                                                  currentProduct._id
                                                }
                                                onClick={this.editActiveProduct}
                                              >
                                                Annuler
                                              </button>
                                              <input
                                                type="submit"
                                                className="btn btn-success d-inline"
                                                value="Valider"
                                                data-aisle-id={
                                                  currentProduct._id
                                                }
                                              />
                                            </div>
                                          </Form>
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </ListGroupItem>
                            ))}
                        </ListGroup>
                        <button
                          className="btn mt-4 btn-outline-danger"
                          onClick={this.removeAllProducts}
                        >
                          Supprimer tous les produits
                        </button>
                      </>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <Loader />
          )}
        </div>

        <ToastContainer />
      </>
    );
  }
}
