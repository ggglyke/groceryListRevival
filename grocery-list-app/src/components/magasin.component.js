import React, { Component } from "react";
import AisleDataService from "../services/aisle.service";
import MagasinDataService from "../services/magasin.service";
import { FaBars } from "react-icons/fa";
import "../scss/main.scss";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../scss/main.scss";
import EmptyState from "./reusable/empty-state.component";
import Loader from "./reusable/loader.component";

export default class Magasin extends Component {
  constructor(props) {
    super(props);
    this.retrieveAisles = this.retrieveAisles.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);

    this.state = {
      id: null,
      rayons: [],
      rayonsLoaded: false,
      title: "",
      magasin: {},
      magasinLoaded: false,
      isLoading: true,
      user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : false,
    };
  }

  componentDidUpdate() {
    const { isLoading, rayonsLoaded, magasinLoaded } = this.state;
    if (isLoading && rayonsLoaded && magasinLoaded) {
      this.setState({
        isLoading: false,
      });
    }
  }

  orderAisles() {
    const rayons = this.state.rayons;
    const sortingArr = this.state.magasin.rayonsOrder;
    rayons.sort(function (a, b) {
      var A = a["_id"],
        B = b["_id"];

      if (sortingArr.indexOf(A) < sortingArr.indexOf(B)) {
        return -1;
      } else {
        return 1;
      }
    });
    this.setState({
      ...this.state,
      rayons: rayons,
      rayonsLoaded: true,
    });
  }

  componentDidMount() {
    this.getMagasinDetails();
  }

  saveMagasin() {
    const magasin = this.state.magasin;
    var id = this.state.magasin._id;

    MagasinDataService.update(id, magasin)
      .then((response) => {
        this.getMagasinDetails();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getMagasinDetails() {
    const id = this.props.match.params.id;
    MagasinDataService.get(id)
      .then((response) => {
        this.setState(
          {
            magasinExists: true,
            magasin: response.data,
            magasinLoaded: true,
          },
          () => this.retrieveAisles()
        );
      })
      .catch((e) => {
        console.log(e);
        this.setState({
          magasinExists: false,
        });
      });
  }

  retrieveAisles() {
    AisleDataService.getAllUserAisles(this.state.user._id)
      .then((response) => {
        this.setState(
          {
            rayons: response.data,
          },
          () => this.orderAisles()
        );
      })
      .catch((e) => {
        console.log(e);
      });
  }

  onDragEnd(param) {
    const listeAislesIds = this.state.rayons.map((aisle) => aisle._id);
    const sourceId = param.source.index;
    const destinationId = param.destination?.index;
    if (destinationId != null) {
      listeAislesIds.splice(
        destinationId,
        0,
        listeAislesIds.splice(sourceId, 1)[0]
      );
      this.setState(
        {
          ...this.state,
          magasin: {
            ...this.state.magasin,
            rayonsOrder: listeAislesIds,
          },
        },
        () => this.saveMagasin()
      );
    }
  }

  render() {
    const { rayons, currentIndex, magasinExists, magasin, isLoading } =
      this.state;
    return (
      <>
        <div className="breadcrumbs mb-5">
          <div className="container">
            <div className="row">
              <div className="col py-2 text-muted">
                Accueil {">"} <a href="./magasins">Magasins</a> {">"}{" "}
                {magasin && magasin.title}
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          {!isLoading ? (
            <div className="row d-flex justify-content-center">
              <div className="col-sm-12 col-md-8 col-lg-6 mt-5 list-container px-5 py-4 d-flex flex-column">
                <h1 className="mb-4">{magasin && magasin.title}</h1>

                <p className="text-small">
                  Changez l'ordre des rayons grâce au glisser-déposer. L'ordre
                  des rayons détermine l'ordre d'affichage des produits dans vos
                  listes.
                </p>
                <p>Liste des rayons :</p>
                <DragDropContext onDragEnd={this.onDragEnd}>
                  <Droppable droppableId="droppable-1">
                    {(provided, _) => (
                      <ul
                        className="list-group"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {rayons ? (
                          rayons.map((aisle, index) => (
                            <Draggable
                              key={aisle._id}
                              draggableId={"draggable-" + aisle._id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <li
                                  className={
                                    "list-group-item d-flex justify-content-between " +
                                    (index === currentIndex ? "active" : "")
                                  }
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  key={index}
                                >
                                  {aisle.title}
                                  <div {...provided.dragHandleProps}>
                                    <FaBars className="text-muted" />
                                  </div>
                                </li>
                              )}
                            </Draggable>
                          ))
                        ) : (
                          <li className="text-muted">Aucun aisle trouvé</li>
                        )}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
          ) : (
            <Loader />
          )}
        </div>
      </>
    );
  }
}
