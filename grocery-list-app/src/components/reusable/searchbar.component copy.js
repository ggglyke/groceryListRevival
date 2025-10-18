import React, { useState, Component } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import ProductsList from "../products-list.component";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";

function SearchBar({
  placeholder,
  dbProducts,
  onClickResult,
  productsInList,
  handleOpen,
  handleChangeNewProductName,
  newProductName,
}) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFilter = (e) => {
    const searchWord = newProductName;
    setWordEntered(searchWord);
    const newFilter = dbProducts.filter((item) => {
      return item.title.toLowerCase().includes(searchWord.toLowerCase());
    });
    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }

    // create Array of ids of products already in list : ["651vd64", "54fezfe"...]
    const productsAlreadyInList = newFilter
      .filter((productInFilter) => productsInList.includes(productInFilter._id))
      .map((a) => a._id);

    newFilter.map((a) => {
      if (productsAlreadyInList.includes(a._id)) return (a.selected = true);
    });
    newFilter.map((a) => {
      if (!productsAlreadyInList.includes(a._id)) return (a.selected = false);
    });
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  return (
    <div className="search">
      <div className="searchInputs">
        <Form>
          <Form.Group controlId="autocompleteProducts">
            <Form.Label className="mb-2 fw-bold">
              Ajouter un produit à la liste :
            </Form.Label>
            <Form.Control
              type="text"
              placeholder={placeholder}
              value={wordEntered}
              onChange={(e) => {
                handleFilter(e);
                handleChangeNewProductName(e);
              }}
            />
          </Form.Group>
        </Form>
      </div>
      {filteredData.length > 0 ? (
        <div className="dataResult">
          {filteredData.slice(0, 15).map((item, index) => {
            return (
              <div
                className={`dataItem ${item.selected && "selected"}`}
                key={index}
                data-id={item._id}
                onClick={(e) => {
                  onClickResult(e);
                  clearInput();
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
        wordEntered !== "" && (
          <div className="dataResult productDoesNotExist">
            <div className="dataItem text-small">
              {`"` + wordEntered + `" n'existe pas, ajouter à la liste ?`}
              <Form>
                <Form.Group>
                  <Button
                    className="mt-2 btn btn-primary"
                    size="sm"
                    onClick={(e) => {
                      handleOpen();
                    }}
                  >
                    {" "}
                    Ajouter
                  </Button>
                </Form.Group>
              </Form>
            </div>
          </div>
        )
      )}
    </div>
  );
}
export default SearchBar;
