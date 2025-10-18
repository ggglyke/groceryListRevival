import React, { Component } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import ProductDataService from "../../services/product.service";

import "react-bootstrap-typeahead/css/Typeahead.css";

export default class Autocomplete extends Component {
  constructor(props) {
    super(props);
    this.retrieveProducts = this.retrieveProducts.bind(this);
    this.handleAutocomplete = this.handleAutocomplete.bind(this);
    this.ref = React.createRef();
    this.state = {
      options: [],
    };
  }

  componentDidMount() {
    this.retrieveProducts();
  }

  retrieveProducts() {
    ProductDataService.getAll()
      .then((response) => {
        this.setState({
          options: response.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  handleAutocomplete(product) {
    product[0] && this.props.handler(product[0]);
    this.ref.current.clear();
  }

  render() {
    var { options } = this.state;
    return (
      <Typeahead
        options={options}
        minLength={1}
        labelKey={(option) => `${option.title}`}
        onChange={this.handleAutocomplete}
        selected={this.state.selected}
        id="autocomplete"
        ref={this.ref}
        renderMenuItemChildren={(option) => (
          <div key={option._id}>
            <span>{option.title}</span> -{" "}
            <span className="text-muted">{option.rayon.title}</span>
          </div>
        )}
      />
    );
  }
}
