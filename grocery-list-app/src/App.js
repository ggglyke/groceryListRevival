import React, { useEffect } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import { useAuth } from "./context/AuthContext";

import SiteNavbar from "./components/reusable/navbar.component";
import ProductsList from "./components/products-list.component";
import AislesList from "./components/aisles-list.component";
import Lists from "./components/lists/Lists";
import List from "./components/list.component";
import Magasins from "./components/magasins/Magasins";
import Magasin from "./components/magasin.component";
import ListTest from "./components/listTest.component";
import Home from "./components/home.component";
import PrivateRoute from "./components/privateRoute.component";
import Login from "./components/login.component";
import Register from "./components/register.component";

export default function App() {
  const { loading, authenticated, verify, user } = useAuth();

  useEffect(() => {
    verify();
  }, [verify]);

  const ListWrapper = (props) => {
    const params = useParams();
    return <List {...{ ...props, match: { params } }} />;
  };

  const MagasinWrapper = (props) => {
    const params = useParams();
    return <Magasin {...{ ...props, match: { params } }} />;
  };

  if (loading) return <div className="p-4">Chargement…</div>;

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
          <Route
            path={"/lists/:id"}
            element={<ListWrapper userId={user?._id} />}
          />
          <Route path={"/magasins"} element={<Magasins userId={user?._id} />} />
          <Route path={"/aisles"} element={<AislesList />} />
          <Route path={"/products"} element={<ProductsList />} />
          <Route path={"/magasin/:id"} element={<MagasinWrapper />} />
        </Route>
      </Routes>

      <ToastContainer />
    </>
  );
}
