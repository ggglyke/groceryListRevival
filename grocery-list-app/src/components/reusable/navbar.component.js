import React from "react";
import { useCookies } from "react-cookie";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import UserDataService from "../../services/user.service";

export default function SiteNavbar() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const user = JSON.parse(localStorage.getItem("user"));
  const logout = async () => {
    removeCookie("jwt");
    localStorage.removeItem("user");
    const { data } = await UserDataService.logout({ withCredentials: true });
    if (data) {
      console.log(data);
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
          {user && (
            <DropdownButton
              data-bs-theme="dark"
              variant="outline-secondary"
              title={`Salut ${user.username} !`}
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
