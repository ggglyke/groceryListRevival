import React, { Component } from "react";
import AisleDataService from "../services/aisle.service";

import { BsExclamationTriangle } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";

import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";

import "../scss/main.scss";
import EmptyState from "./reusable/empty-state.component";
import TooltipComponent from "./reusable/tooltip.component";
import Loader from "./reusable/loader.component";

export default class AddAisle extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeEditAisle = this.onChangeEditAisle.bind(this);
    this.retrieveAisles = this.retrieveAisles.bind(this);
    this.saveAisle = this.saveAisle.bind(this);
    this.newAisle = this.newAisle.bind(this);
    this.setActiveAisle = this.setActiveAisle.bind(this);
    this.editActiveAisle = this.editActiveAisle.bind(this);
    this.updateAisle = this.updateAisle.bind(this);
    this.deleteAisle = this.deleteAisle.bind(this);

    this.state = {
      id: null,
      rayons: [],
      title: "",
      submitted: false,
      currentAisle: null,
      currentIndex: -1,
      edit: false,
      editAisleTitle: "",
      editAisleId: "",
      isLoading: true,
      user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : false,
    };
    this.baseState = this.state;
  }

  componentDidMount() {
    document.title = `Rayons - ${process.env.REACT_APP_APP_NAME}`;
    this.retrieveAisles();
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value,
    });
  }

  onChangeEditAisle(e) {
    this.setState({
      editAisleTitle: e.target.value,
    });
  }

  retrieveAisles() {
    AisleDataService.getAllUserAisles(this.state.user._id)
      .then((response) => {
        this.setState({
          rayons: response.data,
          isLoading: false,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  setActiveAisle(aisle) {
    this.setState({
      currentAisle: aisle,
      editAisleTitle: aisle.title,
      editAisleId: aisle._id,
      edit: true,
    });
  }

  updateAisle(e) {
    e.preventDefault();
    var id = this.state.editAisleId;
    var data = {
      title: this.state.editAisleTitle,
      aisle: this.state.editAisleId,
      user: this.state.user,
    };

    AisleDataService.update(id, data)
      .then((response) => {
        this.setState(
          {
            id: response.data.id,
            title: response.data.title,
            currentAisle: null,
            edit: false,
            submitted: true,
          },
          () => {
            this.retrieveAisles();
          }
        );
      })
      .catch((e) => {
        console.log(e);
      });
  }

  deleteAisle(e) {
    e.preventDefault();
    var confirm = window.confirm(
      "Mer il é fou ! Voulez-vous vraiment supprimer ce rayon ?"
    );
    if (confirm === true) {
      var id = e.target.getAttribute("data-aisle-id");
      AisleDataService.delete(id)
        .then((response) => {
          this.setState(this.baseState, this.retrieveAisles());
        })
        .catch((e) => {
          console.log("e");
        });
    }
  }

  saveAisle(e) {
    e.preventDefault();
    var data = {
      userId: this.state.user._id,
      title: this.state.title,
      isDefault: false,
    };

    console.log(data);

    AisleDataService.create(data)
      .then((response) => {
        this.setState(
          {
            id: response.data.id,
            title: "",
            submitted: true,
          },
          () => {
            this.retrieveAisles();
          }
        );
      })
      .catch((e) => {
        console.log(e);
      });
  }

  editActiveAisle(e) {
    if (!this.state.edit) {
      this.setState({
        editAisleTitle: e.target.getAttribute("data-aisle-title"),
        editAisleId: e.target.getAttribute("data-aisle-id"),
      });
    } else {
      this.setState({
        edit: false,
        currentAisle: null,
      });
    }
  }

  newAisle() {
    this.setState({
      id: null,
      title: "",
      submitted: false,
    });
  }

  render() {
    const {
      rayons,
      isLoading,
      editAisleTitle,
      currentIndex,
      currentAisle,
      edit,
    } = this.state;
    return (
      <>
        <div className="breadcrumbs mb-5">
          <div className="container">
            <div className="row">
              <div className="col py-2 text-muted">
                Accueil {">"} <a href="./rayons">Rayons</a>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          {!isLoading ? (
            <>
              <div className="row d-flex justify-content-center">
                <div className="col-sm-12 col-md-8 col-lg-6 mt-5 list-container px-5 py-4 d-flex flex-column">
                  <h1 className="text-center fw-bold mt-3 mb-4">Rayons</h1>
                  <Form onSubmit={this.saveAisle} className="my-3">
                    <Form.Group controlId="newAisleTitle" className="mb-3">
                      <Form.Label>Nom du nouveau rayon :</Form.Label>
                      <Form.Control
                        type="text"
                        required
                        value={this.state.title}
                        onChange={this.onChangeTitle}
                        placeholder="Ex : fruits et légumes"
                      ></Form.Control>
                    </Form.Group>
                    <div className="d-grid">
                      <input
                        className="btn btn-primary mt-2"
                        type="submit"
                        value="Ajouter le rayon"
                      />
                    </div>
                  </Form>
                  {!rayons ||
                    (rayons.length < 1 ? (
                      <div className="empty-state d-flex flex-column align-items-center mt-2">
                        <EmptyState />

                        <h1 className="mt-5">C'est bien vide par ici.</h1>
                        <p>Et si on commençait par créer un rayon ?...</p>
                      </div>
                    ) : (
                      <>
                        <h5 className="mt-4">Tous les rayons</h5>

                        <ListGroup>
                          {rayons &&
                            rayons.map((item, index) => (
                              <ListGroupItem
                                className={
                                  "d-flex align-items-start flex-column " +
                                  (index === currentIndex ? " active" : "")
                                }
                                key={index}
                              >
                                <div className="d-flex align-self-stretch align-items-center justify-content-between">
                                  <div>
                                    {item.title}
                                    <br />
                                    {item.isDefault && (
                                      <span className="text-small text-muted">
                                        Rayon par défaut
                                      </span>
                                    )}
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
                                            this.setActiveAisle(item)
                                          }
                                        >
                                          Renommer
                                          {item.isDefault && (
                                            <TooltipComponent text="vous pouvez uniquement renommer le rayon par défaut, pas le supprimer" />
                                          )}
                                        </Dropdown.Item>

                                        {!item.isDefault && (
                                          <>
                                            <Dropdown.Divider />
                                            <Dropdown.Item
                                              onClick={this.deleteAisle}
                                              data-aisle-id={item._id}
                                            >
                                              <div
                                                className="text-danger d-flex align-items-center"
                                                data-aisle-id={item._id}
                                              >
                                                <BsExclamationTriangle className="me-1" />
                                                Supprimer
                                              </div>
                                            </Dropdown.Item>
                                          </>
                                        )}
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </div>
                                </div>
                                {currentAisle &&
                                  currentAisle._id === item._id && (
                                    <div className="asideEdit align-self-stretch mt-3">
                                      <div>
                                        {edit && (
                                          <Form onSubmit={this.updateAisle}>
                                            <Form.Group
                                              controlId="editAisleTitle"
                                              className="mb-3"
                                            >
                                              <Form.Label className="fw-bold">
                                                Nom :
                                              </Form.Label>
                                              <Form.Control
                                                type="text"
                                                required
                                                value={editAisleTitle}
                                                onChange={
                                                  this.onChangeEditAisle
                                                }
                                              ></Form.Control>
                                            </Form.Group>
                                            <div>
                                              <button
                                                type="button"
                                                className="btn btn-outline-secondary me-3"
                                                data-aisle-id={currentAisle._id}
                                                onClick={this.editActiveAisle}
                                              >
                                                Annuler
                                              </button>
                                              <input
                                                type="submit"
                                                className="btn btn-success d-inline"
                                                value="Valider"
                                                data-aisle-id={currentAisle._id}
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
                          onClick={this.removeAllAisles}
                        >
                          Supprimer tous les rayons
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
