import React from "react";
import { Link } from "react-router-dom";

/**
 * Layout réutilisable pour toutes les pages principales
 * @param {Array} breadcrumbs - Tableau d'objets {label, path} pour le fil d'Ariane
 * @param {string} title - Titre optionnel de la page (si null, pas de titre affiché)
 * @param {React.ReactNode} children - Contenu de la page
 * @param {React.ReactNode} headerActions - Actions optionnelles à droite du titre
 * @param {string} error - Message d'erreur optionnel
 */
export default function PageLayout({
  breadcrumbs = [],
  title,
  children,
  headerActions,
  error,
}) {
  // S'assurer que breadcrumbs est toujours un tableau
  const breadcrumbsArray = Array.isArray(breadcrumbs) ? breadcrumbs : [];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <div className="container">
          <div className="row">
            <div className="col py-2 text-muted">
              <Link to="/">Accueil</Link>
              {breadcrumbsArray.length > 0 && " > "}
              {breadcrumbsArray.map((crumb, index) => (
                <React.Fragment key={index}>
                  {crumb.path ? (
                    <Link to={crumb.path}>{crumb.label}</Link>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                  {index < breadcrumbsArray.length - 1 && " > "}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="row justify-content-center">
          <div className="col-sm-12 col-md-8 col-lg-6 mt-5 list-container px-4 px-md-5 py-4">
            {/* Header avec titre et actions */}
            {(title || headerActions) && (
              <div className="d-flex justify-content-between align-items-center mb-4">
                {title && <h1 className="mb-0">{title}</h1>}
                {headerActions && <div>{headerActions}</div>}
              </div>
            )}

            {/* Contenu de la page */}
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
