/* React */
import React from "react";

/* libraries */

/* react-bootstrap */
import {
  ListGroup as ListGroupBootstrap,
  ListGroupItem,
} from "react-bootstrap";

/* own components */

/* scss */
import "../../scss/main.scss";

/* data */

const ListGroup = ({ products, filteredRayons }) => {
  return (
    <>
      <ListGroupBootstrap className="list-group mb-4">
        {}
        {filteredRayons.map((rayon, index) => (
          <>
            <ListGroupItem
              className="list-group-item font-weight-bold bg-light"
              key={index}
            >
              <div className="d-flex flex-column">
                <span>{rayon.title}</span>
              </div>
            </ListGroupItem>
            {products
              .filter((product) => product.rayon === rayon.id)
              .map((product, productIndex) => (
                <li className="list-group-item" key={productIndex}>
                  <div className="d-flex flex-column">
                    <span>{product.title}</span>
                  </div>
                </li>
              ))}
          </>
        ))}
      </ListGroupBootstrap>
    </>
  );
};

export default ListGroup;
