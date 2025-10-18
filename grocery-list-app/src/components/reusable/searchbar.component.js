import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleChangeFilter = this.handleChangeFilter.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleFocusBlur = this.handleFocusBlur.bind(this);

    this.state = {
      filteredData: [],
      productName: "",
      emptyPrompt: true,
      showResults: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.newProductName !== this.props.newProductName &&
      this.props.newProductName === ""
    ) {
      this.setState({
        emptyPrompt: true,
        filteredData: [],
        productName: "",
      });
    }
  }

  handleChangeFilter(e) {
    this.setState(
      {
        productName: e.target.value,
        emptyPrompt: false,
      },
      () => this.handleFilter(e)
    );
  }
  handleFocusBlur(e) {
    this.setState({
      showResults: !this.state.showResults,
    });
  }
  handleOpenModal(e) {
    this.props.handleOpen();
    this.setState({ productName: "" });
  }

  handleFilter = (e) => {
    // handle change controlled input
    this.props.handleChangeNewProductName(e);

    // prompt
    const searchWord = this.state.productName;

    // create an array with products matching the prompt
    let newFilter = this.props.dbProducts.filter((item) => {
      return item.title.toLowerCase().includes(searchWord.toLowerCase());
    });

    // update state or empy results if no prompt
    if (searchWord === "") {
      this.setState({
        filteredData: [],
      });
    } else {
      this.setState({
        filteredData: newFilter,
      });
    }

    // create Array of ids of products already in list : ["651vd64", "54fezfe"...]
    let productsAlreadyInList = newFilter
      .filter((productInFilter) =>
        this.props.productsInList.includes(productInFilter._id)
      )
      .map((a) => a._id);

    newFilter.map((a) => {
      productsAlreadyInList.includes(a._id)
        ? (a.selected = true)
        : (a.selected = false);
    });
    this.setState({
      filteredData: newFilter,
    });
  };

  render() {
    const { placeholder, onClickResult, emptyPrompt } = this.props;
    const { filteredData, productName } = this.state;
    return (
      <div key={emptyPrompt} className="search">
        <div className="searchInputs">
          <Form>
            <Form.Group controlId="autocompleteProducts">
              <Form.Label className="mb-2 fw-bold">
                Ajouter un produit à la liste :
              </Form.Label>
              <Form.Control
                type="text"
                placeholder={placeholder}
                value={!this.state.emptyPrompt ? productName : ""}
                onChange={this.handleChangeFilter}
                onBlur={this.handleFocusBlur}
                onFocus={this.handleFocusBlur}
              />
            </Form.Group>
          </Form>
        </div>
        {this.props.listHasAisles &&
        filteredData.length > 0 &&
        this.state.showResults ? (
          <div className="dataResult">
            {filteredData.slice(0, 15).map((item, index) => {
              return (
                <div
                  className={`dataItem ${item.selected && "selected"}`}
                  key={index}
                  data-id={item._id}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    onClickResult(e);
                  }}
                >
                  <p>
                    {item.title}
                    {item.selected && (
                      <Badge pill bg="success" className="ms-2 text-small">
                        ✓
                      </Badge>
                    )}
                  </p>
                  {item.rayon.title && (
                    <p className="text-small text-muted">{item.rayon.title}</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          productName !== "" &&
          this.state.showResults && (
            <div className="dataResult productDoesNotExist">
              <div className="dataItem text-small">
                {`"` + productName + `" n'existe pas, ajouter à la liste ?`}
                <Form>
                  <Form.Group>
                    {this.props.listHasAisles === true ? (
                      <>
                        <Button
                          className="mt-2 btn btn-primary"
                          size="sm"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            this.handleOpenModal();
                          }}
                        >
                          {" "}
                          Ajouter
                        </Button>
                        <Button
                          variant="outline-primary"
                          className="mt-2 ms-2"
                          size="sm"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={(e) => {
                            this.props.quickAdd(e);
                          }}
                        >
                          {" "}
                          Ajout rapide (divers)
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="mt-2 ms-2"
                        size="sm"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          this.props.quickAdd(e);
                        }}
                      >
                        {" "}
                        Ajouter
                      </Button>
                    )}
                  </Form.Group>
                </Form>
              </div>
            </div>
          )
        )}
      </div>
    );
  }
}
