/* React */
import React from "react";

/* libraries */
import { Link } from "react-router-dom";

/* react-bootstrap */

/* own components */

/* scss */
import "../../scss/main.scss";

/* data */

const Breadcrumbs = ({ breadcrumbs }) => {
  return (
    <div className="breadcrumbs">
      <div className="container">
        <div className="row">
          <div className="col py-2 text-muted">
            <Link to="/">Accueil</Link>
            {breadcrumbs.map((item, index) =>
              item.link ? (
                <React.Fragment key={index}>
                  {" > "}
                  <Link key={index} to={item.link}>
                    <span>{item.title}</span>
                  </Link>
                </React.Fragment>
              ) : (
                <span key={index}>{` > ${item.title}`}</span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumbs;
