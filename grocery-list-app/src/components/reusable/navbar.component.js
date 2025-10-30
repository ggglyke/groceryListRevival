import React from "react";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Badge from "react-bootstrap/Badge";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useAuth } from "../../context/AuthContext";
import useBackendStatus from "../../hooks/useBackendStatus";
import UserDataService from "../../services/user.service";

export default function SiteNavbar() {
  const navigate = useNavigate();
  const { authenticated, user, logoutLocal } = useAuth();
  const { status, BACKEND_STATUS } = useBackendStatus();

  const logout = async () => {
    try {
      await UserDataService.logout({ withCredentials: true });
      logoutLocal(); // Nettoie l'état d'auth local
      navigate("/login");
    } catch (err) {
      console.error("Erreur lors de la déconnexion", err);
      // Déconnecte quand même localement
      logoutLocal();
      navigate("/login");
    }
  };

  // Obtient les propriétés du badge selon le statut du backend
  const getStatusBadgeProps = () => {
    switch (status) {
      case BACKEND_STATUS.CONNECTED:
        return { bg: "success", text: "Serveur OK" };
      case BACKEND_STATUS.STARTING:
        return { bg: "warning", text: "Démarrage..." };
      case BACKEND_STATUS.DISCONNECTED:
        return { bg: "danger", text: "Serveur hors ligne" };
      default:
        return { bg: "secondary", text: "Inconnu" };
    }
  };

  const statusBadge = getStatusBadgeProps();

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="./lists">Liste de courses</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          id="responsive-navbar-nav"
          className="d-lg-flex justify-content-between"
        >
          <Nav>
            <Nav.Link href="./lists">Listes</Nav.Link>
            <Nav.Link href="./products">Produits</Nav.Link>
            <Nav.Link href="./aisles">Rayons</Nav.Link>
            <Nav.Link href="./magasins">Magasins</Nav.Link>
          </Nav>
          <div className="d-flex align-items-center gap-2">
            <Badge
              bg={statusBadge.bg}
              className="px-2 py-1"
              title="État du serveur backend"
            >
              {statusBadge.text}
            </Badge>
            {authenticated && user && (
              <DropdownButton
                data-bs-theme="dark"
                variant="outline-secondary"
                title={`Salut ${user.username || 'utilisateur'} !`}
              >
                <Dropdown.Item>Mon compte</Dropdown.Item>
                <Dropdown.Item onClick={logout}>Déconnexion</Dropdown.Item>
              </DropdownButton>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
