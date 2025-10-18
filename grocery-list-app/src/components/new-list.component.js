import React, { Component } from "react";
import ProductDataService from "../services/product.service";
import Autocomplete from "./reusable/autocomplete.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ListDataService from "../services/list.service";

export default class ProductsList extends Component {
  constructor(props) {
    super(props);
    this.searchTitle = this.searchTitle.bind(this);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.addProductToList = this.addProductToList.bind(this);
    this.removeProductFromList = this.removeProductFromList.bind(this);
    this.createList = this.createList.bind(this);

    this.state = {
      products: [],
      searchTitle: "",
    };
  }

  createList() {
    let data = this.state.products.map((product) => product._id);
    console.log(data);
    ListDataService.create(data);
  }

  removeProductFromList(e) {
    // get product id
    var productIdToRemove = e.currentTarget.getAttribute("data-product-id");

    // create array from state products
    var oldProductsArray = this.state.products;

    // find array index to remove
    var removeIndex = oldProductsArray
      .map(function (item) {
        return item._id;
      })
      .indexOf(productIdToRemove);

    // remove item from array at found index
    oldProductsArray.splice(removeIndex, 1);

    // set state products with new array
    this.setState(
      {
        products: oldProductsArray,
      },
      console.log("update")
    );
  }

  onChangeSearchTitle() {
    console.log("dummy");
  }

  addProductToList(product) {
    let saveAction;
    if (this.state.products.length < 1) {
      saveAction = this.createList;
    } else {
      saveAction = this.updateList;
    }

    var stateProductsArray = [...this.state.products];
    stateProductsArray.indexOf(product) === -1 &&
      this.setState(
        {
          products: [...this.state.products, product],
        },
        saveAction
      );
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
    const { products } = this.state;

    return (
      <div className="list row">
        <div className="col-md-8">
          <Autocomplete handler={this.addProductToList} />
        </div>
        <div className="col-md-6">
          <h4>Nouvelle liste</h4>

          <ul className="list-group">
            {products &&
              products.map((product, index) => (
                <li className="list-group-item d-flex" key={index}>
                  {product.title}
                  <span className="text-muted">
                    <span className="text-muted mx-1">-</span>
                    {product.rayon.title}
                  </span>
                  <button
                    data-product-id={product._id}
                    className="btn btn-sm btn-outline-danger ml-auto"
                    onClick={this.removeProductFromList}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </li>
              ))}
          </ul>

          <button
            className="m-3 btn btn-sm btn-danger"
            onClick={this.removeAllProducts}
          >
            Remove All
          </button>
        </div>
      </div>
    );
  }
}
