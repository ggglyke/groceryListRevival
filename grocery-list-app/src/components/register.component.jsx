import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import UserDataService from "../services/user.service";
import PasswordInput from "./reusable/PasswordInput";
import PasswordRules from "./reusable/PasswordRules";
import extractPasswordError from "../utils/extractPasswordError";

import "../scss/login-register.scss";

export default function Register() {
  const navigate = useNavigate();
  const { authenticated } = useAuth();

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [registered, setRegistered] = useState(false);

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
    if (Array.isArray(errors)) {
      const passwordError = extractPasswordError(errors);
      if (passwordError) return generateError(passwordError);
      return generateError(errors[0]?.message || "Une erreur est survenue");
    }
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
      const { data } = await UserDataService.register(
        { ...userData },
        { withCredentials: true },
      );
      if (data?.errors) {
        handleErrors(data.errors);
      } else {
        setRegistered(true);
      }
    } catch (err) {
      if (err?.response?.data?.errors) {
        handleErrors(err.response.data.errors);
      } else {
        console.error("handleSubmit error : ", err);
        generateError("Erreur réseau, réessayez");
      }
    }
  };

  return (
    <div className="container ">
      <div className="row d-flex justify-content-center ">
        <div className="col-sm-12 col-md-8 col-lg-6 mt-5 form-container px-5 py-4 d-flex flex-column">
          <div className="img-container">
            <img src="./logo192.png" alt="" />
          </div>
          <h2 className="mt-4 mb-5 text-center">
            Compte créé ! Vérifiez vos emails
          </h2>
          {registered ? (
            <p className="text-center">
              Vérifiez votre boîte mail puis cliquez sur le lien pour activer
              votre compte.
              <br />
              Puis <Link to="/login">connectez-vous</Link>.
            </p>
          ) : (
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
                    setUserData({
                      ...userData,
                      [e.target.name]: e.target.value,
                    })
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
                    setUserData({
                      ...userData,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>
                  Mot de passe <span className="text-danger">*</span>
                </Form.Label>
                <PasswordInput
                  required
                  controlId="password"
                  placeholder="Mot de passe"
                  name="password"
                  value={userData.password}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
                <PasswordRules password={userData.password} />
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
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
