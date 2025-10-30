import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import UserDataService from "../services/user.service";
import MagasinDataService from "../services/magasin.service";
import AisleDataService from "../services/aisle.service";

import rayonsData from "../data/rayons.data";

import "../scss/login-register.scss";

export default function Register() {
  const navigate = useNavigate();
  const { authenticated } = useAuth();

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Redirige vers /lists si l'utilisateur est déjà connecté
  useEffect(() => {
    if (authenticated) {
      navigate("/lists", { replace: true });
    }
  }, [authenticated, navigate]);

  const generateError = (err) =>
    toast.error(err, {
      position: "top-right",
    });

  const handleErrors = (errors) => {
    const { username, email, password, title, user } = errors;
    if (username) generateError(username);
    else if (email) generateError(email);
    else if (password) generateError(password);
    else if (title) generateError(title);
    else if (user) generateError(user);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // register user in database
      const registeredUserData = await UserDataService.register(
        { ...userData },
        { withCredentials: true }
      );
      if (registeredUserData) {
        console.log("response", registeredUserData);
        // handle response
        handleRegisteredUserData(registeredUserData.data);
      }
    } catch (err) {
      console.error("handleSubmit error : ", err);
    }
  };

  const handleRegisteredUserData = async (registeredUserData) => {
    try {
      if (registeredUserData.errors) {
        handleErrors(registeredUserData.errors);
      } else {
        // create default Magasin
        const dataDefaultMagasin = await createDefaultMagasin(
          registeredUserData.user
        );
        if (dataDefaultMagasin) {
          handleDefaultMagasinData(dataDefaultMagasin, registeredUserData.user);
        }
      }
    } catch (err) {
      console.error("handleRegisteredUserData : ", err);
    }
  };

  const handleDefaultMagasinData = async (dataDefaultMagasin, user) => {
    console.log("handleDefaultMagasinData user : ", user);
    try {
      if (dataDefaultMagasin.errors) {
        handleErrors(dataDefaultMagasin.errors);
      } else {
        const defaultRayonData = rayonsData.map((item) => ({
          title: item.title,
          user: user,
          isDefault: item.isDefault,
        }));
        const dataDefaultAisles = await AisleDataService.insertMany(
          defaultRayonData,
          { withCredentials: true }
        );
        if (dataDefaultAisles) {
          handledefaultAislesData(dataDefaultAisles, user);
        }
      }
    } catch (err) {
      console.error("handleDefaultMagasinData : ", err);
    }
  };

  const handledefaultAislesData = (dataDefaultAisles, user) => {
    try {
      if (dataDefaultAisles.errors) {
        handleErrors(dataDefaultAisles.errors);
      } else {
        navigate("/login/?accountCreated=true");
      }
    } catch (err) {
      console.error("handledefaultAislesData : ", err);
    }
  };

  const createDefaultMagasin = async (user) => {
    console.log("createDefaultMagasin", user);
    return await MagasinDataService.create(
      {
        title: "Mon magasin par défaut",
        user,
        isDefault: true,
      },
      { withCredentials: true }
    );
  };

  /*try {
      const { data } = await UserDataService.register(
        { ...values },
        { withCredentials: true }
      );
      if (data) {
        console.log("data newly registered user : ", data);
        if (data.errors) {
          const { username, email, password } = data.errors;
          if (username) generateError(username);
          else if (email) generateError(email);
          else if (password) generateError(password);
        } else {
          // user created, create default magasin
          try {
            const { data: dataMagasin } = await MagasinDataService.create(
              {
                title: "Mon magasin par défaut",
                user: data.user,
                isDefault: true,
              },
              { withCredentials: true }
            );
            if (dataMagasin) {
              console.log("dataMag :", dataMagasin);
              if (dataMagasin.errors) {
                const { title, user } = dataMagasin.errors;
                if (title) generateError(title);
                else if (user) generateError(user);
              } else {
                // user created, create default aisles
                try {
                  const newRayonsData = rayonsData.map((item) => ({
                    title: item.title,
                    user: data.user,
                  }));
                  const { data: dataAisles } =
                    await AisleDataService.insertMany(newRayonsData, {
                      withCredentials: true,
                    });
                  if (dataAisles) {
                    console.log("dataAisles :", dataAisles);
                    if (dataAisles.errors) {
                      const { title, user } = dataAisles.errors;
                      if (title) generateError(title);
                      else if (user) generateError(user);
                    } else {
                      navigate("/login?accountCreated=true");
                    }
                  } else {
                    console.log("pas dataAisles :(");
                  }
                } catch (err) {
                  console.log(err);
                }
              }
            } else {
              console.log("pas dataMag :(");
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }*/

  return (
    <div className="container ">
      <div className="row d-flex justify-content-center ">
        <div className="col-sm-12 col-md-8 col-lg-6 mt-5 form-container px-5 py-4 d-flex flex-column">
          <div className="img-container">
            <img src="./logo192.png" alt="" />
          </div>
          <h2 className="mt-4 mb-5 text-center">Créer un compte</h2>
          <Form onSubmit={(e) => handleSubmit(e)}>
            <Form.Group controlId="username" className="mb-3">
              <Form.Label>
                Nom d'utilisateur, pseudo, prénom...{" "}
                <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Ex: tintin72"
                name="username"
                onChange={(e) =>
                  setUserData({ ...userData, [e.target.name]: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>
                Adresse email <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="Ex: philippe@grues-passion.fr"
                name="email"
                onChange={(e) =>
                  setUserData({ ...userData, [e.target.name]: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>
                Mot de passe <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Mot de passe"
                name="password"
                onChange={(e) =>
                  setUserData({ ...userData, [e.target.name]: e.target.value })
                }
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" className="my-4">
                Créer un compte
              </Button>
            </div>
            <Form.Text muted>
              <p className="text-center mt-2">
                Déjà un compte ? <Link to="/login">Connectez-vous.</Link>
              </p>
            </Form.Text>
          </Form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
