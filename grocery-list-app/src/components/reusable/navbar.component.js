import React from "react";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useAuth } from "../../context/AuthContext";
import UserDataService from "../../services/user.service";

export default function SiteNavbar() {
  const navigate = useNavigate();
  const { authenticated, user, logoutLocal } = useAuth();

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
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
