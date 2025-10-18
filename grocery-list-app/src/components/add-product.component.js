import React, { Component } from "react";
import ProductDataService from "../services/product.service";
import AisleDataService from "../services/aisle.service";
import Form from "react-bootstrap/Form";

export default class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.retrieveAisles = this.retrieveAisles.bind(this);
    this.handleSelectAisleChange = this.handleSelectAisleChange.bind(this);
    this.saveProduct = this.saveProduct.bind(this);
    this.newProduct = this.newProduct.bind(this);

    this.state = {
      id: null,
      rayons: [],
      title: "",
      published: false,
      submitted: false,
    };
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value,
    });
  }

  componentDidMount() {
    this.retrieveAisles();
  }

  retrieveAisles() {
    AisleDataService.getAll()
      .then((response) => {
        this.setState({
          rayons: response.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  handleSelectAisleChange(event) {
    this.setState({ rayonValue: event.target.value });
  }

  saveProduct(e) {
    e.preventDefault();
    var data = {
      title: this.state.title,
      aisle: this.state.rayonValue,
    };

    ProductDataService.create(data)
      .then((response) => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          aisle: response.data.rayon,
          submitted: true,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  newProduct() {
    this.setState({
      id: null,
      title: "",
      published: false,
      submitted: false,
    });
  }

  render() {
    return (
      <>
        {this.state.submitted && (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newProduct}>
              Add
            </button>
          </div>
        )}
        <Form onSubmit={this.saveProduct}>
          <Form.Group controlId="newProductTitle">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              required
              type="text"
              value={this.state.title}
              onChange={this.onChangeTitle}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="newProductRayon">
            <Form.Label>Rayon</Form.Label>
            <Form.Select onChange={this.handleSelectAisleChange}>
              <option value="none" isdisabled="true">
                -- choisir un rayon --
              </option>
              {this.state.rayons.map((aisle) => (
                <option key={aisle._id} value={aisle._id}>
                  {aisle.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button type="submit">Envoyer</Button>
        </Form>
      </>
    );
  }
}
