import React, { useState, useMemo } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import UserDataService from "../services/user.service";
import PasswordInput from "./reusable/PasswordInput";
import PasswordRules from "./reusable/PasswordRules";
import extractPasswordError from "../utils/extractPasswordError";
import "../scss/login-register.scss";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const token = query.get("token");

  const [values, setValues] = useState({ password: "", confirmPassword: "" });
  const [submitting, setSubmitting] = useState(false);

  const generateError = (err) => toast.error(err, { position: "top-right" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      return generateError("Lien invalide, veuillez refaire une demande");
    }
    if (!values.password || !values.confirmPassword) {
      return generateError("Veuillez remplir les deux champs");
    }
    if (values.password !== values.confirmPassword) {
      return generateError("Les mots de passe ne correspondent pas");
    }
    setSubmitting(true);
    try {
      const { data } = await UserDataService.resetPassword({
        token,
        password: values.password,
      });
      if (data?.reset) {
        toast.success("Mot de passe réinitialisé avec succès, connectez-vous !", {
          position: "top-right",
        });
        navigate("/login", { replace: true });
      } else {
        const passwordError = extractPasswordError(data?.errors);
        const tokenError = Array.isArray(data?.errors)
          ? null
          : data?.errors?.token;
        if (passwordError) generateError(passwordError);
        else if (tokenError) generateError(tokenError);
        else generateError("Une erreur est survenue, réessayez");
      }
    } catch (err) {
      const errors = err?.response?.data?.errors;
      if (errors) {
        const passwordError = extractPasswordError(errors);
        const tokenError = Array.isArray(errors) ? null : errors.token;
        if (passwordError) generateError(passwordError);
        else if (tokenError) generateError(tokenError);
        else generateError("Une erreur est survenue, réessayez");
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
          <h2 className="mt-4 mb-5 text-center">Réinitialiser le mot de passe</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="password" className="mb-3">
              <Form.Label>
                Nouveau mot de passe <span className="text-danger">*</span>
              </Form.Label>
              <PasswordInput
                controlId="password"
                placeholder="Nouveau mot de passe"
                name="password"
                value={values.password}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>
                Confirmer le mot de passe <span className="text-danger">*</span>
              </Form.Label>
              <PasswordInput
                controlId="confirmPassword"
                placeholder="Confirmer le mot de passe"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
              <PasswordRules password={values.password} />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button
                variant="primary"
                type="submit"
                className="my-4"
                disabled={submitting}
              >
                Réinitialiser le mot de passe
              </Button>
            </div>
          </Form>
          <Form.Text muted>
            <p className="mt-2 text-center">
              <Link to="/login">Retour à la connexion</Link>
            </p>
          </Form.Text>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
