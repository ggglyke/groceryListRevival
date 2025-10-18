import React, { Component } from "react";
import MagasinDataService from "../services/magasin.service";
import { Link } from "react-router-dom";

import ListGroup from "react-bootstrap/ListGroup";

import "../scss/main.scss";
import EmptyState from "./reusable/empty-state.component";
import Loader from "./reusable/loader.component";

export default class Magasins extends Component {
  constructor(props) {
    super(props);
    this.retrieveMagasins = this.retrieveMagasins.bind(this);
    this.state = {
      lists: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    document.title =
      "Liste des magasins" + " - " + process.env.REACT_APP_APP_NAME;
    this.retrieveMagasins();
  }

  retrieveMagasins() {
    MagasinDataService.findManyByCondition({
      user: JSON.parse(localStorage.user)._id,
    })
      .then((response) => {
        console.log(response.data);
        this.setState({
          isLoading: false,
          magasins: response.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { magasins, isLoading } = this.state;
    return (
      <>
        <div className="breadcrumbs mb-5">
          <div className="container">
            <div className="row">
              <div className="col py-2 text-muted">
                Accueil {">"} <a href="./magasins">Magasins</a>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          {!isLoading ? (
            <>
              {magasins && magasins.length > 0 ? (
                <div className="row d-flex justify-content-center">
                  <div className="col-sm-12 col-md-8 col-lg-6 mt-5 list-container px-5 py-4 d-flex flex-column">
                    <div className="d-flex justify-content-between mb-4">
                      <h1>Vos magasins</h1>
                      <button
                        onClick={this.createNewList}
                        className="btn btn-primary align-self-start"
                      >
                        Ajouter
                      </button>
                    </div>
                    <ListGroup>
                      {magasins &&
                        magasins.map((magasin, index) => (
                          <Link
                            to={"/magasin/" + magasin._id}
                            className={"list-group-item list-group-item-action"}
                            key={index}
                          >
                            {magasin.title}
                          </Link>
                        ))}
                    </ListGroup>
                  </div>
                </div>
              ) : (
                <div className="row d-flex justify-content-center">
                  <div className="col-sm-12 col-md-8 col-lg-6 d-flex flex-column">
                    <div className="empty-state d-flex flex-column align-items-center">
                      <EmptyState />

                      <h1 className="mt-5">C'est bien vide par ici.</h1>
                      <p>Et si on commençait par...</p>
                      <button
                        onClick={this.createNewList}
                        className="btn btn-success"
                      >
                        Ajouter une liste
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Loader />
          )}
        </div>
      </>
    );
  }
}
