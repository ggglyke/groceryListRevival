import React, { Component } from "react";
import { Navigate } from "react-router-dom";

import ListDataService from "../services/list.service";
import MagasinDataService from "../services/magasin.service";
import ProductDataService from "../services/product.service";
import AisleDataService from "../services/aisle.service";

import SearchBar from "./reusable/searchbar.component";
import Loader from "./reusable/loader.component";

// Bootstrap
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

import { FaPen, FaTimes, FaCheck } from "react-icons/fa";

import "../scss/main.scss";
import { ThemeProvider } from "react-bootstrap";

export default class List extends Component {
  constructor(props) {
    super(props);

    // products
    this.toggleCheck = this.toggleCheck.bind(this);
    this.onClickResult = this.onClickResult.bind(this);
    this.removeProductFromList = this.removeProductFromList.bind(this);
    this.customizeProduct = this.customizeProduct.bind(this);
    this.cancelCustimizeProduct = this.cancelCustimizeProduct.bind(this);
    this.submitCustomProduct = this.submitCustomProduct.bind(this);
    this.handleChangeCustomizing = this.handleChangeCustomizing.bind(this);
    this.changeMagasin = this.changeMagasin.bind(this);
    this.updateProductCounter = this.updateProductCounter.bind(this);

    // list title
    this.onChangeListNewTitle = this.onChangeListNewTitle.bind(this);
    this.submitNewTitle = this.submitNewTitle.bind(this);

    // list
    this.deleteList = this.deleteList.bind(this);
    this.deleteAllProductsFromList = this.deleteAllProductsFromList.bind(this);
    this.deleteAllCheckedProductsFromList =
      this.deleteAllCheckedProductsFromList.bind(this);

    // quick add
    this.quickAdd = this.quickAdd.bind(this);

    // modal
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);

    // new Product via modal
    this.handleChangeNewProductName =
      this.handleChangeNewProductName.bind(this);
    this.onChangeNewProductAisle = this.onChangeNewProductAisle.bind(this);
    this.alsoAddNewProductToDatabase =
      this.alsoAddNewProductToDatabase.bind(this);
    this.submitNewProduct = this.submitNewProduct.bind(this);

    this.state = {
      list: {},
      listExists: true,
      mergedProducts: [],
      isLoading: true,
      dbProducts: [],
      products: [],
      magasins: [],
      editingTitle: false,
      listNewTitle: "",
      listDeleted: false,
      showModal: false,
      alsoAddToDatabase: false,
      newProductName: "",
      productsToDisplay: [],
      rayonList: [],
    };
  }

  componentDidMount() {
    this.getList();
    this.getMagasins();
    this.retrieveProducts();
    this.retrieveAisles();
  }

  quickAdd(e) {
    this.setState(
      {
        isLoading: true,
        newProductAisle: "6428230cb0c3980042ab9b77",
        alsoAddToDatabase: false,
        productName: "",
      },
      () => this.submitNewProduct(e)
    );
  }

  submitNewProduct(e) {
    e.preventDefault();
    if (this.state.alsoAddToDatabase === true) {
      // add product to database and add it to the list normally

      // check if name and aisle are correct
      if (
        this.state.newProductName !== "" &&
        this.state.newProductAisle !== ""
      ) {
        // create product to add to the list from state data
        const newProductToAddToDb = {
          title: this.state.newProductName,
          rayon: this.state.newProductAisle,
        };
        // add the product to the database
        ProductDataService.create(newProductToAddToDb)
          .then((response) => {
            // get the product data
            const returnedProduct = {
              _id: response.data._id,
            };
            // add product to state.list.products
            this.setState(
              {
                list: {
                  ...this.state.list,
                  products: [...this.state.list.products, returnedProduct],
                },
                showModal: false,
              },
              () => {
                // save the list
                this.saveList();
                this.retrieveProducts();
              }
            );
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        e.stopPropagation();
        alert("Entrez un nom de produit et choisissez un rayon");
      }
    } else {
      // submit custom product
      if (this.state.newProductName && this.state.newProductAisle) {
        this.setState(
          {
            newProductName: "",
            newProductAisle: "",
            list: {
              ...this.state.list,
              customProducts: [
                ...this.state.list.customProducts,
                {
                  title: this.state.newProductName,
                  rayon: this.state.newProductAisle,
                },
              ],
            },
            showModal: false,
          },
          () => {
            this.saveList();
          }
        );
      } else {
        e.stopPropagation();
        alert("Entrez un nom de produit et choisissez un rayon");
      }
    }
  }

  alsoAddNewProductToDatabase(e) {
    this.setState({
      alsoAddToDatabase: e.target.checked,
    });
  }

  retrieveAisles() {
    AisleDataService.getAll()
      .then((response) => {
        this.setState({
          aisles: response.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getList() {
    let { id } = this.props.match.params;
    ListDataService.get(id)
      .then((response) => {
        const listData = response.data;
        this.setState(
          {
            listNewTitle: listData.title,
            list: listData,
            listExists: true,
            products: [],
          },
          () => this.mergeCustomAndIsolateCheckedProducts()
        );
        document.title =
          "Liste " + listData.title + " - " + process.env.REACT_APP_APP_NAME;
      })
      .catch((e) => {
        console.log(e);
        this.setState({
          listExists: false,
        });
      });
  }
  orderProductsByAisle(products, checkedProducts) {
    if ([...products, checkedProducts].length > 0) {
      let sortedProducts = [];
      let sortingArr = [];

      this.state.list.magasin
        ? MagasinDataService.get(this.state.list.magasin)
            .then((response) => {
              sortingArr = response.data.rayonsOrder;
              // sort products by aisle order
              sortedProducts = products.sort(
                (a, b) =>
                  sortingArr.indexOf(a.rayon._id) -
                  sortingArr.indexOf(b.rayon._id)
              );

              sortedProducts = products.reduce((acc, product) => {
                const rayonName = product.rayon.title;
                const rayonId = product.rayon._id;
                if (!acc[rayonId]) {
                  acc[rayonId] = {
                    _id: rayonId,
                    title: rayonName,
                    products: [],
                  };
                }
                acc[rayonId].products.push(product);
                return acc;
              }, {});

              const rayonList = Object.values(sortedProducts);

              // merge the 2 arrays, place checked products at the end
              this.setState({
                ...this.state,
                rayonList: rayonList,
                productsToDisplay: {
                  unchecked: sortedProducts,
                  checked: [...checkedProducts],
                },
                isLoading: false,
              });
            })
            .catch((e) => {
              console.log(e);
            })
        : this.setState({ isLoading: false });
    } else {
      this.setState({
        ...this.state,
        isLoading: false,
      });
    }
  }
  getMagasins() {
    MagasinDataService.getAll()
      .then((response) => {
        this.setState({
          magasins: response.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }
  changeMagasin(e) {
    e.target.value !== 0 &&
      this.setState(
        {
          ...this.state,
          list: {
            ...this.state.list,
            magasin: e.target.value,
          },
        },
        () => this.saveList()
      );
  }
  retrieveProducts() {
    ProductDataService.getAll()
      .then((response) => {
        this.setState({
          dbProducts: response.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }
  mergeCustomAndIsolateCheckedProducts() {
    // empty actual state
    this.setState({ products: [] });

    // create Array
    let mergedProducts = [];

    // if list exists populate state with merged products from list products & customProducts
    if (
      (this.state.list.products && this.state.list.products.length > 0) ||
      (this.state.list.customProducts && this.state.list.customProducts.length)
    ) {
      // ids list of checked products
      let checkedFilter = this.state.list.checkedProducts;

      // merge existing products
      mergedProducts = [
        ...this.state.list.products,
        ...this.state.list.customProducts,
      ];

      // create 2 arrays, one with only unckecked products other with only checked products

      // create Array with unchecked products
      let uncheckedProductsArray = [...mergedProducts].filter(function (
        product
      ) {
        return checkedFilter.indexOf(product._id) <= -1;
      });

      // create Array with checked products
      let checkedProductsArray = [...mergedProducts].filter(function (product) {
        return checkedFilter.indexOf(product._id) > -1;
      });

      // an an 'checked' attribute to all products in the checkedProducts Array
      checkedProductsArray.map(function (a) {
        return (a.checked = true);
      });

      // order unchecked products by aisle
      this.orderProductsByAisle(uncheckedProductsArray, checkedProductsArray);
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  toggleCheck(e) {
    const productId = e.currentTarget.dataset.productid;
    this.setState({ isLoading: true }, () => {
      this.setState(
        (prevState) => {
          const checkedProductsArray = prevState.list.checkedProducts;
          const newCheckedProductsArray = checkedProductsArray.includes(
            productId
          )
            ? checkedProductsArray.filter((id) => id !== productId)
            : [...checkedProductsArray, productId];
          return {
            list: {
              ...prevState.list,
              checkedProducts: newCheckedProductsArray,
            },
          };
        },
        () => this.saveList()
      );
    });
  }

  onClickResult(e) {
    // get clicked product id
    const clickedProductId = e.currentTarget.dataset.id;
    // get dbProducts from dstate
    const stateProducts = this.state.dbProducts;
    // get products from original list
    const listProducts = this.state.list.products;

    // get the clicked product from state
    const filteredProductFromState = stateProducts.filter((item) => {
      return item._id.includes(clickedProductId);
    });

    // get products with same id from state products (>0 means already in the list)
    const filteredProductFromList = listProducts.filter((item) => {
      return item._id.includes(clickedProductId);
    });

    if (filteredProductFromState.length) {
      if (filteredProductFromList.length > 0) {
      } else {
        this.setState(
          {
            isLoading: true,
            list: {
              ...this.state.list,
              products: [
                ...this.state.list.products,
                filteredProductFromState[0],
              ],
            },
            newProductName: "",
          },
          () => {
            this.saveList();
            //this.orderProductsByAisle();
            this.updateProductCounter(filteredProductFromState[0]._id);
          }
        );
      }
    }
  }

  updateProductCounter(product_id) {
    ProductDataService.get(product_id)
      .then((response) => {
        const product = response.data;
        console.log(product);
        var counter = product.times_added >= 0 ? product.times_added + 1 : 1;
        console.log("counter", 1 >= 0);
        var data = {
          times_added: counter,
        };

        ProductDataService.update(product_id, data)
          .then((response) => {
            console.log("compteur mis à jour ! ", response.data);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  cancelCustimizeProduct(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      customizing: null,
    });
  }

  customizeProduct(e) {
    e.preventDefault();
    e.stopPropagation();

    let customizeId = e.currentTarget.dataset.id;
    let oldProductName = e.currentTarget.dataset.oldproducttitle;
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      customizing: customizeId,
      customizingProductName: oldProductName,
    });
  }

  handleChangeCustomizing(e) {
    this.setState({
      customizingProductName: e.target.value,
    });
  }

  onChangeListNewTitle(e) {
    this.setState({
      listNewTitle: e.target.value,
    });
  }

  submitNewTitle(e) {
    e.preventDefault();
    var id = this.state.list._id;
    e.preventDefault();
    var data = {
      title: this.state.listNewTitle,
    };
    ListDataService.update(id, data)
      .then((response) => {
        this.setState(
          {
            editingTitle: false,
          },
          this.getList()
        );
      })
      .catch((e) => {
        console.log(e);
      });
  }

  submitCustomProduct(e) {
    this.setState({ isLoading: true });
    e.preventDefault();
    e.stopPropagation();
    let productId = e.currentTarget.dataset.id;
    let filteredRemainingProducts = [];
    let filteredRemainingCustomProducts = [];
    let aisle = {};

    // filter list products & customProducts to remove the removeId
    filteredRemainingProducts = this.state.list.products.filter(function (a) {
      return a._id !== productId;
    });
    filteredRemainingCustomProducts = this.state.list.customProducts.filter(
      function (a) {
        return a._id !== productId;
      }
    );

    // retrieve aisle of product in list.products or in list.customProducts if not found
    aisle = this.state.list.products.filter((a) => {
      return a._id === productId;
    })[0];

    if (!aisle) {
      aisle = this.state.list.customProducts.filter((a) => {
        return a._id === productId;
      })[0];
    }

    // update state & save list
    this.setState(
      {
        customizing: null,
        list: {
          ...this.state.list,
          products: filteredRemainingProducts,
          customProducts: [
            ...filteredRemainingCustomProducts,
            {
              title: this.state.customizingProductName,
              rayon: aisle.rayon,
            },
          ],
        },
      },
      () => this.saveList()
    );
  }

  removeProductFromList(e) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({ isLoading: true });

    // product id to remove
    let removeId = e.currentTarget.dataset.id;
    // empty arrays
    let filteredRemainingProducts = [];
    let filteredRemainingCustomProducts = [];
    let filteredRemainingCheckedIds = [];

    // filter list.products & list.customProducts to remove the removeId
    filteredRemainingProducts = this.state.list.products.filter(
      (a) => a._id !== removeId
    );
    filteredRemainingCustomProducts = this.state.list.customProducts.filter(
      (a) => a._id !== removeId
    );

    // filter checkedProducts to remove the one removeId if checked
    filteredRemainingCheckedIds = this.state.list.checkedProducts.filter(
      function (a) {
        return a !== removeId;
      }
    );

    // update state & save list
    this.setState(
      {
        list: {
          ...this.state.list,
          products: filteredRemainingProducts,
          customProducts: filteredRemainingCustomProducts,
          checkedProducts: filteredRemainingCheckedIds,
        },
      },
      () => this.saveList()
    );
  }

  saveList() {
    const list = this.state.list;
    var id = this.state.list._id;
    this.setState({
      products: [],
    });
    ListDataService.update(id, list)
      .then((response) => {
        this.getList();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  deleteList() {
    let confirmText =
      `Mer il é fou ! Voulez-vous vraiment supprimer la liste "` +
      this.state.list.title +
      `" ?`;
    var confirm = window.confirm(confirmText);
    if (confirm === true) {
      let listId = this.state.list._id;
      ListDataService.delete(listId)
        .then((response) => {
          this.setState({
            listDeleted: true,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  deleteAllCheckedProductsFromList(e) {
    e.preventDefault();
    e.stopPropagation();
    let confirmText =
      "Mer il é fou ! Voulez-vous vraiment supprimer tous les produits checkés ? ";
    var confirm = window.confirm(confirmText);

    if (confirm === true) {
      let unckeckedProducts = this.state.list.products.filter((a) => {
        return !a.checked;
      });
      let unckeckedCustomProducts = this.state.list.customProducts.filter(
        (a) => {
          return !a.checked;
        }
      );
      this.setState(
        {
          list: {
            ...this.state.list,
            products: unckeckedProducts,
            customProducts: unckeckedCustomProducts,
            checkedProducts: [],
          },
        },
        () => this.saveList()
      );
    }
  }

  deleteAllProductsFromList(e) {
    e.preventDefault();
    e.stopPropagation();
    let confirmText =
      "Mer il é fou ! Voulez-vous vraiment supprimer tous les produits ? ";
    var confirm = window.confirm(confirmText);
    if (confirm === true) {
      this.setState(
        {
          products: [],
          list: {
            ...this.state.list,
            products: [],
            customProducts: [],
            checkedProducts: [],
          },
        },
        () => this.saveList()
      );
    }
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleChangeNewProductName(e) {
    this.setState({
      newProductName: e.target.value,
    });
  }

  onChangeNewProductAisle(e) {
    this.setState({ newProductAisle: e.target.value });
  }

  render() {
    const {
      list,
      listExists,
      editingTitle,
      listNewTitle,
      products,
      productsToDisplay,
      dbProducts,
      magasins,
      aisles,
      isLoading,
      newProductName,
      rayonList,
    } = this.state;
    const productsInList = this.state.list.products;

    return (
      <>
        {this.state.listDeleted && <Navigate to="/lists" replace={true} />}

        <div className="row">
          <div className="col-md-6 my-2">
            <div className="breadcrumbs mb-2">
              <a href="./lists">Retour aux listes</a>
            </div>
          </div>
        </div>
        {listExists ? (
          <>
            <div className="row">
              <div className="col-md-6 my-2 position-relative">
                {isLoading && (
                  <div className="loader">
                    <Loader></Loader>
                    <p className="fw-bold">Chargement...</p>
                  </div>
                )}
                <div
                  className={`col-list-container ${isLoading ? " blur" : ""} `}
                >
                  {editingTitle ? (
                    <Form className="d-flex" onSubmit={this.submitNewTitle}>
                      <Form.Group controlId="listNewName" className="flex1">
                        <Form.Control
                          type="text"
                          className="form-control editInput"
                          required
                          value={listNewTitle}
                          onChange={this.onChangeListNewTitle}
                        ></Form.Control>
                        <Form.Label className="smallUnderLabel">
                          Nouveau nom pour la liste
                        </Form.Label>
                      </Form.Group>
                      <div>
                        <Button
                          type="submit"
                          variant="primary"
                          className="mx-2"
                        >
                          Mettre à jour
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => this.setState({ editingTitle: false })}
                        >
                          Annuler
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    <h1 className="editH1">
                      {list.title}
                      <small>
                        <FaPen
                          onClick={() => this.setState({ editingTitle: true })}
                        />
                      </small>
                    </h1>
                  )}

                  <div className="mt-4">
                    <Form>
                      <Form.Group controlId="selectShop">
                        <Form.Label className="fw-bold">
                          Attribuer un magasin à la liste
                        </Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          value={
                            this.state.list.magasin && this.state.list.magasin
                          }
                          onChange={this.changeMagasin}
                        >
                          {magasins.map((magasin, i) => (
                            <option value={magasin._id} key={i}>
                              {magasin.title}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Form>
                  </div>

                  <div className="search-autocomplete my-4">
                    {products && (
                      <SearchBar
                        placeholder="ex : Bananes"
                        dbProducts={dbProducts}
                        listHasAisles={this.state.list.hasAisles}
                        productsInList={
                          productsInList &&
                          productsInList.map((product) => product._id)
                        }
                        onClickResult={this.onClickResult}
                        handleOpen={this.handleOpenModal}
                        quickAdd={this.quickAdd}
                        handleChangeNewProductName={
                          this.handleChangeNewProductName
                        }
                        newProductName={newProductName}
                      />
                    )}
                  </div>

                  <>
                    <ul className="list-group">
                      {productsToDisplay.unchecked && (
                        <>
                          {rayonList.map((rayon, index) => (
                            <React.Fragment key={rayon.title}>
                              <li
                                className="list-group-item fw-bold bg-light rayonTitle"
                                key={rayon.title}
                              >
                                {rayon.title}
                                <div className="img-container ms-2">
                                  <img
                                    src={"./images/" + rayon._id + ".svg"}
                                    alt={rayon.title}
                                  />
                                </div>
                              </li>
                              {rayon.products.map((product, index) => (
                                <li
                                  className={
                                    "list-group-item product" +
                                    (product.checked ? " checked" : "")
                                  }
                                  key={index}
                                >
                                  {this.state.customizing === product._id ? (
                                    <Form className="d-flex justify-content-between flex-fill">
                                      <Form.Group
                                        className="py-3"
                                        controlId="changeProductName"
                                      >
                                        <Form.Control
                                          type="text"
                                          autoFocus
                                          className="mb-2"
                                          value={
                                            this.state.customizingProductName
                                          }
                                          onChange={
                                            this.handleChangeCustomizing
                                          }
                                          onClick={(e) => e.stopPropagation()}
                                        ></Form.Control>
                                        <Form.Check
                                          type="switch"
                                          label="Produit permanent ?"
                                        ></Form.Check>
                                      </Form.Group>

                                      <div className="ms-2 d-flex align-items-center">
                                        <Button
                                          data-id={product._id}
                                          onClick={this.submitCustomProduct}
                                          className="me-2"
                                        >
                                          <FaCheck />
                                        </Button>

                                        <Button
                                          variant="outline-secondary"
                                          onClick={this.cancelCustimizeProduct}
                                        >
                                          <FaTimes />
                                        </Button>
                                      </div>
                                    </Form>
                                  ) : (
                                    <>
                                      <div className="d-flex align-items-center">
                                        <div
                                          className="check-area d-flex"
                                          data-productid={product._id}
                                          onClick={this.toggleCheck}
                                        >
                                          <div className="tick"></div>
                                        </div>
                                        <span className="product-title">
                                          {product.title}
                                        </span>
                                      </div>
                                      <div className="d-flex">
                                        <div
                                          className="icon-container edit"
                                          data-id={product._id}
                                          data-oldproducttitle={product.title}
                                          onClick={this.customizeProduct}
                                        >
                                          <FaPen />
                                        </div>

                                        <div
                                          className="icon-container delete"
                                          data-id={product._id}
                                          onClick={this.removeProductFromList}
                                        >
                                          <FaTimes />
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </li>
                              ))}
                            </React.Fragment>
                          ))}
                        </>
                      )}
                      {productsToDisplay.checked &&
                        productsToDisplay.checked.length > 0 && (
                          <>
                            <li className="list-group-item fw-bold bg-light rayonTitle">
                              <div className="img-container me-2">
                                <img
                                  src="./images/full-cart.svg"
                                  alt="panier"
                                />
                              </div>
                              Dans le panier
                            </li>
                            {productsToDisplay.checked.map((product, index) => (
                              <li
                                className={
                                  "list-group-item product" +
                                  (product.checked ? " checked" : "")
                                }
                                key={index}
                                data-productid={product._id}
                              >
                                {this.state.customizing === product._id ? (
                                  <div className="form-container d-flex py-1">
                                    <Form>
                                      <Form.Group controlId="changeProductName">
                                        <Form.Control
                                          type="text"
                                          autoFocus
                                          value={
                                            this.state.customizingProductName
                                          }
                                          onChange={
                                            this.handleChangeCustomizing
                                          }
                                          onClick={(e) => e.stopPropagation()}
                                        ></Form.Control>
                                      </Form.Group>
                                    </Form>
                                    <div className="ms-2 d-flex align-items-center">
                                      <Button
                                        data-id={product._id}
                                        onClick={this.submitCustomProduct}
                                        className="me-2"
                                      >
                                        <FaCheck />
                                      </Button>
                                      <Button
                                        variant="outline-secondary"
                                        onClick={this.cancelCustimizeProduct}
                                      >
                                        <FaTimes />
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="d-flex align-items-center">
                                      <div
                                        className="check-area d-flex"
                                        data-productid={product._id}
                                        onClick={this.toggleCheck}
                                      >
                                        <div className="tick"></div>
                                      </div>
                                      <div>
                                        <span className="text-muted text-small d-block rayon-title">
                                          {product.rayon.title}
                                          <br />
                                        </span>
                                        <span className="product-title d-block">
                                          {product.title}
                                        </span>
                                      </div>
                                    </div>
                                    <div></div>
                                    <div className="d-flex">
                                      <div
                                        className="icon-container edit"
                                        data-id={product._id}
                                        data-oldproducttitle={product.title}
                                        onClick={this.customizeProduct}
                                      >
                                        <FaPen />
                                      </div>
                                      <div
                                        className="icon-container delete"
                                        data-id={product._id}
                                        onClick={this.removeProductFromList}
                                      >
                                        <FaTimes />
                                      </div>
                                    </div>
                                  </>
                                )}
                              </li>
                            ))}
                          </>
                        )}
                    </ul>
                    <div>
                      <ButtonGroup className="mt-4" size="sm">
                        <Button variant="danger" onClick={this.deleteList}>
                          Supprimer la liste
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={this.deleteAllProductsFromList}
                        >
                          Vider la liste
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={this.deleteAllCheckedProductsFromList}
                        >
                          Supprimer les produits checkés
                        </Button>
                      </ButtonGroup>
                    </div>
                  </>
                </div>
              </div>
            </div>
          </>
        ) : (
          <Alert key={"danger"} variant={"danger"}>
            La liste demandée n'a pas été trouvée.{" "}
            <Alert.Link href="/groceryList/lists">
              Revenir aux listes
            </Alert.Link>
          </Alert>
        )}
        <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              Ajouter &laquo;<span className="fw-bold">{newProductName}</span>
              &raquo; à la liste
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={this.submitNewProduct}>
            <Modal.Body>
              <Form.Group controlId="productName" className="mb-3">
                <Form.Label className="fw-bold">
                  Nom du nouveau produit :
                </Form.Label>
                <Form.Control
                  type="text"
                  value={newProductName}
                  onChange={this.handleChangeNewProductName}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="newProductAisle" className="mb-3">
                <Form.Label className="fw-bold">Rayon :</Form.Label>
                <Form.Select
                  required
                  onChange={this.onChangeNewProductAisle}
                  value={this.state.newProductAisle}
                >
                  <option>Choisir un rayon</option>
                  {aisles &&
                    aisles
                      .sort((a, b) => a.title.localeCompare(b.title))
                      .map((aisle) => (
                        <option key={aisle._id} value={aisle._id}>
                          {aisle.title}
                        </option>
                      ))}
                </Form.Select>
              </Form.Group>
              <Form.Check
                checked={this.state.alsoAddToDatabase}
                type="checkbox"
                id="custom-switch"
                label="Ajouter également à la base de produits"
                onChange={this.alsoAddNewProductToDatabase}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleCloseModal}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Ajouter
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </>
    );
  }
}
