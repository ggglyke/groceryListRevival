import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";

import ListDataService from "../services/list.service";
import MagasinDataService from "../services/magasin.service";
import ProductDataService from "../services/product.service";
import AisleDataService from "../services/aisle.service";

import SearchBar from "./reusable/searchbar.component";
import Loader from "./reusable/loader.component";

// Bootstrap
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { FaPen, FaTimes, FaCheck, FaCog } from "react-icons/fa";
import { BsExclamationTriangle } from "react-icons/bs";
import { IconContext } from "react-icons";

import "../scss/main.scss";

export default function List() {
  return <h1>I'm h1</h1>;
}

/*
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
    this.handleClickDeleteCheckedProductsFromList =
      this.handleClickDeleteCheckedProductsFromList.bind(this);
    this.handleClickDeleteAllProducts =
      this.handleClickDeleteAllProducts.bind(this);
    this.handleClickDeleteList = this.handleClickDeleteList.bind(this);

    // quick add
    this.quickAdd = this.quickAdd.bind(this);

    // modal
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleCloseAlertModal = this.handleCloseAlertModal.bind(this);
    this.handleClickAlertModal = this.handleClickAlertModal.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);

    // new Product via modal
    this.handleChangeNewProductName =
      this.handleChangeNewProductName.bind(this);
    this.onChangeNewProductAisle = this.onChangeNewProductAisle.bind(this);
    this.alsoAddNewProductToDatabase =
      this.alsoAddNewProductToDatabase.bind(this);
    this.submitNewProduct = this.submitNewProduct.bind(this);

    this.state = {
      alert: {
        show: false,
        message: "ça va pas non !?",
        confirmButtonText: "Oui, supprimer",
        confirmAction: "",
        variant: "primary",
        title: "Bienvenue",
      },
      customizing: {},
      list: {},
      mergedProducts: [],
      isLoading: true,
      dbProducts: [],
      magasins: [],
      editingTitle: false,
      listNewTitle: "",
      listDeleted: false,
      showModal: false,
      alsoAddToDatabase: false,
      newProductName: "",
      productsToDisplay: [],
      rayonList: [],
      user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : false,
    };
  }

  componentDidMount = async () => {
    try {
      await this.getList();
      await this.getMagasins();
      await this.retrieveProducts();
      await this.retrieveAisles();
      this.setState({
        isLoading: false,
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // Initialization
  getList = async () => {
    try {
      let { id } = this.props.match.params;
      const response = await ListDataService.get(id);

      this.setState(
        {
          listNewTitle: response.data.title,
          list: response.data,
          listExists: true,
        },
        () =>
          this.orderProducts([
            ...response.data.products,
            ...response.data.customProducts,
          ])
      );
      document.title =
        "Liste " + response.data.title + " - " + process.env.REACT_APP_APP_NAME;
    } catch (e) {
      console.error("Error retrieving list:", e);
      throw e;
    }
  };
  getMagasins = async () => {
    try {
      const response = await MagasinDataService.findManyByCondition({
        user: this.state.user._id,
      });

      if (response.data) {
        console.log("magasins :", response.data);
        this.setState({
          magasins: response.data,
        });
      }
    } catch (e) {
      console.error("Error retrieving magasins:", e);
      throw e;
    }
  };
  async retrieveProducts() {
    try {
      const response = await ProductDataService.getAllUserProducts(
        this.state.user._id
      );
      this.setState({
        dbProducts: response.data,
      });
    } catch (e) {
      console.error("Error retrieving products:", e);
      throw e;
    }
  }
  async retrieveAisles() {
    try {
      const response = await AisleDataService.getAll();
      this.setState({
        aisles: response.data,
      });
    } catch (e) {
      console.error("Error retrieving aisles:", e);
      throw e;
    }
  }

  orderProducts(products) {
    const { list } = this.state;
    const idsToRemove = list.checkedProducts;

    // remove checked products from produt list
    const filteredUnckeckedProducts = products.filter(
      (product) => !idsToRemove.includes(product._id)
    );

    // get only checked products
    const filteredCheckedProducts = products.filter((product) =>
      idsToRemove.includes(product._id)
    );

    MagasinDataService.get(list.magasin)
      .then((response) => {
        let sortingArr = response.data.rayonsOrder;

        // sort products by aisle order
        let sortedProducts = filteredUnckeckedProducts.sort(
          (a, b) =>
            sortingArr.indexOf(a.rayon._id) - sortingArr.indexOf(b.rayon._id)
        );

        sortedProducts = sortedProducts.reduce((acc, product) => {
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
            checked: filteredCheckedProducts,
          },
          isLoading: false,
        });
      })
      .catch((e) => {
        console.error(e);
      });
  }

  onChangeListNewTitle(e) {
    this.setState({
      listNewTitle: e.target.value,
    });
  }

  submitNewTitle(e) {
    e.preventDefault();

    this.setState(
      (prevState) => ({
        ...prevState,
        editingTitle: false,
        isLoading: true,
        list: {
          ...prevState.list,
          title: this.state.listNewTitle,
        },
      }),
      () => {
        this.saveList();
      }
    );
  }

  changeMagasin(e) {
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

  handleChangeCustomizing(e) {
    this.setState({
      customizing: { ...this.state.customizing, name: e.target.value },
    });
  }
  customizeProduct(e) {
    e.preventDefault();
    e.stopPropagation();
    let customizeId = e.currentTarget.dataset.id;
    let oldProductName = e.currentTarget.dataset.oldproducttitle;
    let rayon = e.currentTarget.dataset.rayon;
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      customizing: {
        ...this.state.customizing,
        _id: customizeId,
        old_name: oldProductName,
        name: oldProductName,
        rayon: rayon,
      },
    });
  }
  submitCustomProduct(e) {
    e.preventDefault();
    e.stopPropagation();
    const product_id = e.currentTarget.dataset.id;

    // filter List Products
    const filteredListProducts = this.state.list.products.filter(
      (product) => product._id !== product_id
    );

    // filter List custom Products
    const filteredListCustomProducts = this.state.list.customProducts.filter(
      (product) => product._id !== product_id
    );

    this.setState(
      {
        ...this.state,
        customizing: null,
        list: {
          ...this.state.list,
          products: filteredListProducts,
          customProducts: [
            ...filteredListCustomProducts,
            {
              _id: this.state.customizing._id,
              title: this.state.customizing.name,
              rayon: this.state.customizing.rayon,
            },
          ],
        },
      },
      () => this.saveList()
    );
  }
  cancelCustimizeProduct(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      customizing: null,
    });
  }

  removeProductFromList(e) {
    const { list } = this.state;
    e.preventDefault();
    e.stopPropagation();
    this.setState({ isLoading: true });
    const product_id = e.currentTarget.dataset.id;

    // filter products
    let products = list.products.filter(
      (product) => product._id !== product_id
    );

    // filter custom products
    let customProducts = list.customProducts.filter(
      (product) => product._id !== product_id
    );

    // filter checked products
    let checkedProducts = list.checkedProducts.filter(
      (id) => id !== product_id
    );

    this.setState(
      {
        ...this.state,
        list: {
          ...this.state.list,
          products: products,
          customProducts: customProducts,
          checkedProducts: checkedProducts,
        },
      },
      () => this.saveList()
    );
  }

  saveAndRetrieveProducts = () => {
    this.saveList();
    this.retrieveProducts().then(() => {
      this.setState({ isLoading: false });
    });
  };

  saveList() {
    const list = this.state.list;
    var id = this.state.list._id;
    ListDataService.update(id, list)
      .then((response) => {
        this.getList();
      })
      .catch((e) => {
        console.error(e);
      });
  }

  handleClickDeleteCheckedProductsFromList(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      alert: {
        show: true,
        title: "Un peu de ménage ?",
        message: `Voulez-vous vraiment supprimer tous les produits déjà cochés de la liste (${
          this.state.list.checkedProducts.length
        } ${
          this.state.list.checkedProducts.length > 1 ? "produits" : "produit"
        }) ?`,
        confirmButtonText: "Oui, supprimer les produits cochés",
        confirmAction: "DELETE_CHECKED",
        variant: "primary",
      },
    });
  }
  handleClickDeleteList(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      alert: {
        show: true,
        title: "Mer il é fou ! 😱",
        message: "Voulez-vous vraiment supprimer la liste ?",
        confirmButtonText: "Oui, supprimer la liste",
        confirmAction: "DELETE_LIST",
        variant: "danger",
      },
    });
  }
  handleClickDeleteAllProducts(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      alert: {
        show: true,
        title: "Mer il é fou !😱",
        message: [
          `Voulez-vous vraiment supprimer tous les produits de la liste ?`,
          <>
            <br />
            <br />
          </>,
          ` Nombre de produit(s) : ${
            this.state.list.products.length +
            this.state.list.customProducts.length
          }`,
        ],
        confirmButtonText: "Oui, supprimer tous les produits",
        confirmAction: "DELETE_PRODUCTS",
        variant: "danger",
      },
    });
  }

  deleteAllCheckedProductsFromList() {
    const { products, customProducts, checkedProducts } = this.state.list;
    const newProducts = products.filter(
      (product) => !checkedProducts.includes(product._id)
    );
    const newCustomProducts = customProducts.filter(
      (product) => !checkedProducts.includes(product._id)
    );

    this.setState(
      {
        alert: {
          show: false,
        },
        list: {
          ...this.state.list,
          products: newProducts,
          customProducts: newCustomProducts,
          checkedProducts: [], // Vous pouvez également vider les produits cochés si nécessaire
        },
      },
      () => this.saveList()
    );
  }

  deleteAllProductsFromList(e) {
    this.setState(
      {
        alert: {
          show: false,
        },
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

  deleteList() {
    let listId = this.state.list._id;
    ListDataService.delete(listId)
      .then((response) => {
        this.setState({
          listDeleted: true,
        });
      })
      .catch((e) => {
        console.error(e);
      });
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

  // Modal & search form

  onClickResult(e) {
    // get clicked product id
    const clickedProductId = e.currentTarget.dataset.id;
    // get dbProducts from dstate
    const stateProducts = this.state.dbProducts;
    // get products from original list
    const listProducts = this.state.list.products;

    // get the clicked product from state
    const filteredProductFromState = stateProducts.find((item) =>
      item._id.includes(clickedProductId)
    );

    // get products with same id from state products (>0 means already in the list)
    const isAlreadyInList = listProducts.some((item) =>
      item._id.includes(clickedProductId)
    );

    if (filteredProductFromState && !isAlreadyInList) {
      this.setState(
        (prevState) => ({
          isLoading: true,
          list: {
            ...prevState.list,
            products: [...prevState.list.products, filteredProductFromState],
          },
          newProductName: "",
        }),
        () => {
          this.saveList();
          this.updateProductCounter(filteredProductFromState._id);
        }
      );
    }
  }

  async updateProductCounter(product_id) {
    try {
      const { data: product } = await ProductDataService.get(product_id);

      const counter = product.times_added >= 0 ? product.times_added + 1 : 1;

      const data = {
        times_added: counter,
      };

      await ProductDataService.update(product_id, data);
    } catch (error) {
      console.error(error);
    }
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
  submitNewProduct = async (e) => {
    e.preventDefault();

    const {
      newProductName,
      newProductAisle,
      alsoAddToDatabase,
      list: { products },
    } = this.state;

    const validateAndSubmit = async (product) => {
      if (newProductName && newProductAisle) {
        this.setState(
          {
            newProductName: "",
            newProductAisle: "",
            list: {
              ...this.state.list,
              [product]: [
                ...this.state.list[product],
                { title: newProductName, rayon: newProductAisle },
              ],
            },
          },
          async () => await this.saveAndRetrieveProducts()
        );
      } else {
        e.stopPropagation();
        alert("Entrez un nom de produit et choisissez un rayon");
      }
    };

    try {
      if (alsoAddToDatabase && newProductName && newProductAisle) {
        const response = await ProductDataService.create({
          title: newProductName,
          rayon: newProductAisle,
          user: this.state.user._id,
        });
        console.log("return ", response.data);
        const returnedProduct = { _id: response.data.product };

        this.setState(
          {
            list: {
              ...this.state.list,
              products: [...products, returnedProduct],
            },
          },
          async () => {
            await this.updateProductCounter(returnedProduct._id);
            await this.saveList();
          }
        );
      } else {
        validateAndSubmit(alsoAddToDatabase ? "products" : "customProducts");
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ showModal: false }); // Fermer la modale ici, dans le bloc finally
    }
  };
  handleChangeNewProductName(e) {
    this.setState({
      newProductName: e.target.value,
    });
  }
  onChangeNewProductAisle(e) {
    this.setState({ newProductAisle: e.target.value });
  }
  handleOpenModal() {
    this.setState({ showModal: true });
  }
  handleCloseModal() {
    this.setState({ showModal: false });
  }
  handleCloseAlertModal() {
    this.setState({ alert: { show: false } });
  }
  handleClickAlertModal(e) {
    switch (e.currentTarget.dataset.action) {
      case "DELETE_CHECKED":
        this.deleteAllCheckedProductsFromList();
        break;
      case "DELETE_PRODUCTS":
        this.deleteAllProductsFromList();
        break;
      case "DELETE_LIST":
        this.deleteList();
        break;
      default:
        throw new Error(
          "Action non reconnue : " + e.currentTarget.dataset.action
        );
    }
  }
  alsoAddNewProductToDatabase(e) {
    this.setState({
      alsoAddToDatabase: e.target.checked,
    });
  }

  render() {
    const list_id = this.state.list._id;
    const {
      isLoading,
      productsToDisplay,
      rayonList,
      magasins,
      list,
      aisles,
      dbProducts,
      newProductName,
      error,
      editingTitle,
      listNewTitle,
    } = this.state;
    const productsInList = this.state.list.products;

    return (
      <>
        {this.state.listDeleted && <Navigate to="/lists" replace={true} />}
        <>
          <div className="breadcrumbs mb-5">
            <div className="container">
              <div className="row">
                <div className="col py-2 text-muted">
                  Accueil {">"} <a href="./lists">Listes</a> {">"} {list.title}
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row d-flex justify-content-center ">
              <div className="col-sm-12 col-md-8 col-lg-6 list-container px-5 pt-4 pb-5">
                {!isLoading ? (
                  <>
                    {editingTitle ? (
                      <Form onSubmit={this.submitNewTitle}>
                        <Form.Group controlId="listNewName">
                          <Form.Label className="smallUnderLabel">
                            Nouveau nom pour la liste
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="form-control editInput"
                            required
                            value={listNewTitle}
                            onChange={this.onChangeListNewTitle}
                          ></Form.Control>
                        </Form.Group>
                        <div className="mt-2">
                          <Button
                            type="submit"
                            variant="primary"
                            className="me-2"
                            size="sm"
                          >
                            Mettre à jour
                          </Button>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() =>
                              this.setState({ editingTitle: false })
                            }
                          >
                            Annuler
                          </Button>
                        </div>
                      </Form>
                    ) : (
                      <div className="d-flex justify-content-between">
                        <h1 className="editH1">
                          {list.title}
                          <IconContext.Provider
                            value={{ size: ".5em", className: "ms-2" }}
                          ></IconContext.Provider>
                        </h1>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="outline-secondary"
                            id="dropdown-basic"
                          >
                            <FaCog />
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            {list.checkedProducts.length > 0 && (
                              <Dropdown.Item
                                onClick={
                                  this.handleClickDeleteCheckedProductsFromList
                                }
                              >
                                Supprimer les produits cochés
                              </Dropdown.Item>
                            )}

                            {list.products.length + list.customProducts.length >
                              0 && (
                              <Dropdown.Item
                                onClick={this.handleClickDeleteAllProducts}
                              >
                                Vider
                              </Dropdown.Item>
                            )}

                            <Dropdown.Item
                              onClick={() =>
                                this.setState({ editingTitle: true })
                              }
                            >
                              Renommer
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={this.handleClickDeleteList}>
                              <div className="text-danger d-flex align-items-center">
                                <BsExclamationTriangle className="me-1" />
                                Supprimer la liste
                              </div>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    )}
                    <div className="my-4">
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
                          <span className="text-small muted ps-2">
                            <Link to={"/magasins"}>Gérer les magasins</Link>
                          </span>
                        </Form.Group>
                      </Form>
                    </div>
                    <div className="search-autocomplete my-4">
                      {dbProducts.length > 0 && (
                        <SearchBar
                          placeholder="ex : Bananes"
                          dbProducts={dbProducts}
                          listHasAisles={true}
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
                    <ul className="list-group">
                      {rayonList.map((rayon, index) => (
                        <React.Fragment key={rayon.title}>
                          <li
                            className="list-group-item py-2fw-bold bg-light rayonTitle"
                            key={rayon.title}
                          >
                            {rayon.title}
                          </li>
                          {rayon.products.map((product, index) => (
                            <li
                              className={
                                "list-group-item py-2 product d-flex justify-content-between" +
                                (product.checked ? " checked" : "")
                              }
                              key={index}
                            >
                              {this.state.customizing &&
                              this.state.customizing._id === product._id ? (
                                <Form className="d-flex justify-content-between flex-fill">
                                  <Form.Group
                                    className="py-3"
                                    controlId="changeProductName"
                                  >
                                    <Form.Control
                                      type="text"
                                      autoFocus
                                      className="mb-2"
                                      value={this.state.customizing.name}
                                      onChange={this.handleChangeCustomizing}
                                      onClick={(e) => e.stopPropagation()}
                                    ></Form.Control>
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
                                      {
                                        /* Product title 
                                        product.customized &&
                                        product.customized[list_id]
                                          ? product.customized[list_id]
                                          : product.title

                                        /* End product title */
/*}
                                    </span>
                                  </div>
                                  <div className="d-flex">
                                    <div
                                      className="icon-container edit"
                                      data-id={product._id}
                                      data-rayon={product.rayon._id}
                                      data-oldproducttitle={
                                        product.customized &&
                                        product.customized[list_id]
                                          ? product.customized[list_id]
                                          : product.title
                                      }
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
                      {productsToDisplay.checked &&
                        productsToDisplay.checked.length > 0 && (
                          <>
                            <li className="list-group-item py-2 fw-bold bg-light rayonTitle">
                              <div className="cart-img-container me-2">
                                <img
                                  src="./images/full-cart.svg"
                                  alt="panier"
                                />
                              </div>
                              Dans le panier
                            </li>
                            {productsToDisplay.checked.map((product, index) => (
                              <li
                                className="list-group-item py-2 product checked"
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
                  </>
                ) : (
                  <Loader />
                )}
              </div>
            </div>
          </div>
        </>

        <Modal show={this.state.alert.show} onHide={this.handleCloseAlertModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              <b>{this.state.alert.title}</b>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.alert.message}</Modal.Body>
          <Modal.Footer>
            <Button
              variant={`outline-${this.state.alert.variant}`}
              onClick={this.handleCloseAlertModal}
            >
              Annuler
            </Button>
            <Button
              variant={this.state.alert.variant}
              onClick={this.handleClickAlertModal}
              data-action={this.state.alert.confirmAction}
            >
              {this.state.alert.confirmButtonText}
            </Button>
          </Modal.Footer>
        </Modal>
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
}*/
