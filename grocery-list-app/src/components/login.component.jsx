import React, { useState, useEffect, useMemo } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import UserDataService from "../services/user.service";
import "../scss/login-register.scss";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticated, setAuthenticated, verify } = useAuth();

  const [values, setValues] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const isAccountCreated = query.get("accountCreated") === "true";

  // Redirige vers /lists si l'utilisateur est déjà connecté
  useEffect(() => {
    if (authenticated) {
      navigate("/lists", { replace: true });
    }
  }, [authenticated, navigate]);

  useEffect(() => {
    if (isAccountCreated) {
      toast.success("Compte créé avec succès, connectez-vous !", {
        position: "top-right",
      });
    }
  }, [isAccountCreated]);

  const generateError = (err) => toast.error(err, { position: "top-right" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.email || !values.password) {
      return generateError("Email et mot de passe requis");
    }
    setSubmitting(true);
    try {
      const { data } = await UserDataService.login(values);
      if (data?.logged) {
        setAuthenticated(data.user);
        navigate("/lists", { replace: true });
        setTimeout(() => {
          verify?.();
        }, 0);
      } else if (data?.errors) {
        const { email, password } = data.errors;
        if (email) generateError(email);
        if (password) generateError(password);
      } else {
        generateError("Identifiants invalides");
      }
    } catch (err) {
      if (err?.response?.status === 401 && err?.response?.data?.errors) {
        const { email, password } = err.response.data.errors;
        if (email) generateError(email);
        else if (password) generateError(password);
        else generateError("Identifiants invalides");
      } else {
        console.error(err);
        generateError("Erreur réseau, réessayez");
      }
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="container ">
      <div className="row d-flex justify-content-center ">
        <div className="col-sm-12 col-md-8 col-lg-6 mt-3 form-container px-5 py-4 d-flex flex-column">
          <div className="img-container">
            <img src="./logo192.png" alt="" />
          </div>
          <h2 className="mt-4 mb-5 text-center">Se connecter</h2>
          <Form onSubmit={(e) => handleSubmit(e)}>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>
                Adresse email <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Ex: philippe@grues-passion.fr"
                name="email"
                values={values.email}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>
                Mot de passe <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Mot de passe"
                name="password"
                values={values.password}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" className="my-4">
                Se connecter
              </Button>
            </div>
          </Form>
          <Form.Text muted>
            <p className="mt-2 text-center">
              Pas encore de compte ? <Link to="/register">Inscrivez-vous.</Link>
            </p>
          </Form.Text>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
