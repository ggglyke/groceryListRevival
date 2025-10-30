import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import { useAuth } from "./context/AuthContext";

import SiteNavbar from "./components/reusable/navbar.component";
import Products from "./components/products";
import AislesList from "./components/aisles";
import Lists from "./components/lists/Lists";
import List from "./components/list";
import Magasins from "./components/magasins/Magasins";
import Magasin from "./components/magasin";
import ListTest from "./components/listTest.component";
import Home from "./components/home.component";
import PrivateRoute from "./components/privateRoute.component";
import Login from "./components/login.component";
import Register from "./components/register.component";

// Routes publiques qui ne nécessitent pas d'attendre verify()
const PUBLIC_ROUTES = ["/", "/login", "/register", "/list-testing"];

export default function App() {
  const { loading, authenticated, verify, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    verify();
  }, [verify]);

  // Skip le loading pour les routes publiques (améliore l'UX si Render.com démarre lentement)
  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    location.pathname === route || location.pathname.startsWith(route + "/")
  );

  if (loading && !isPublicRoute) {
    return <div className="p-4">Chargement…</div>;
  }

  return (
    <>
      <SiteNavbar />

      <Routes>
        <Route path={"/login/:accountCreated?"} element={<Login />} />
        <Route path={"/register"} element={<Register />} />
        <Route path={"/list-testing"} element={<ListTest />} />
        <Route path={"/"} element={<Home />} />

        <Route element={<PrivateRoute authenticated={authenticated} />}>
          <Route path={"/lists"} element={<Lists userId={user?._id} />} />
          <Route path={"/lists/:id"} element={<List userId={user?._id} />} />
          <Route path={"/magasins"} element={<Magasins userId={user?._id} />} />
          <Route path={"/aisles"} element={<AislesList userId={user?._id} />} />
          <Route path={"/products"} element={<Products userId={user?._id} />} />
          <Route
            path={"/magasin/:id"}
            element={<Magasin userId={user?._id} />}
          />
        </Route>
      </Routes>

      <ToastContainer />
    </>
  );
}
