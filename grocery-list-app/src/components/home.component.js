import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import {
  FaShoppingCart,
  FaListUl,
  FaStore,
  FaSearch,
  FaCheckCircle,
  FaBoxes,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "../scss/main.scss";

const SECTIONS = [
  {
    icon: FaListUl,
    title: "Deux types de listes",
    text: "<ul><li>Une <b>liste de courses</b> (rayonnage, magasin) organise les produits par rayon dans l'ordre de votre magasin.</li> <li>Une <b>liste simple</b> est une checklist libre, idéale pour tout le reste (tâches, cadeaux, réservations...).</li></ul>",
  },
  {
    icon: FaStore,
    title: "Rayons & magasins",
    text: "Définissez l'ordre des rayons de chaque magasin par glisser-déposer. Vos produits s'affichent alors dans cet ordre : plus besoin de zigzaguer en faisant les courses.",
  },
  {
    icon: FaSearch,
    title: "Ajouter des produits",
    text: "Recherchez et ajoutez vos produits en quelques clics, retrouvez des suggestions basées sur vos habitudes, ou ajoutez rapidement un nouvel article avec un lien et un prix optionnels.",
  },
  {
    icon: FaCheckCircle,
    title: "Cocher et célébrer",
    text: "Cochez vos produits au fur et à mesure. Une fois la liste terminée, une petite célébration (et quelques confettis 🎉) vous attend.",
  },
  {
    icon: FaBoxes,
    title: "Gérer votre base",
    text: "Depuis le menu, gérez librement vos produits, rayons et magasins : les changements se répercutent automatiquement dans toutes vos listes.",
  },
];

export default function Home() {
  const { authenticated } = useAuth();

  return (
    <div className="container py-4">
      <div className="row justify-content-center mb-5">
        <div className="col-lg-8 text-center">
          <FaShoppingCart size={48} className="text-primary mb-3" />
          <h1 className="mb-3">Bienvenue sur Grocery List</h1>
          <p className="text-muted fs-5">
            L'application qui organise vos listes de courses par rayon, pour ne
            plus jamais faire demi-tour dans les allées.
          </p>
          {authenticated ? (
            <div className="d-flex justify-content-center gap-2 mt-4">
              <Link to="/lists">
                <Button variant="primary">Voir mes listes</Button>
              </Link>
            </div>
          ) : (
            <div className="d-flex justify-content-center gap-2 mt-4">
              <Link to="/register">
                <Button variant="primary">Créer un compte</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline-primary">Se connecter</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="row g-4 justify-content-center">
        {SECTIONS.map(({ icon: Icon, title, text }) => (
          <div className="col-md-6 col-lg-4" key={title}>
            <div className="list-container h-100 p-4">
              <Icon size={28} className="text-primary mb-3" />
              <h5>{title}</h5>
              <div
                className="text-muted mb-0"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
