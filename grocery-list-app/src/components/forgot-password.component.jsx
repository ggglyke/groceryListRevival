import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import UserDataService from "../services/user.service";
import "../scss/login-register.scss";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const generateError = (err) => toast.error(err, { position: "top-right" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return generateError("Email requis");
    }
    setSubmitting(true);
    try {
      await UserDataService.forgotPassword({ email });
      setSent(true);
      toast.success(
        "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
        { position: "top-right" }
      );
    } catch (err) {
      console.error(err);
      generateError("Erreur réseau, réessayez");
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
          <h2 className="mt-4 mb-5 text-center">Mot de passe oublié</h2>
          {sent ? (
            <p className="text-center">
              Si un compte existe avec cet email, un email contenant un lien
              de réinitialisation a été envoyé.
            </p>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>
                  Adresse email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ex: philippe@grues-passion.fr"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  type="submit"
                  className="my-4"
                  disabled={submitting}
                >
                  Envoyer le lien de réinitialisation
                </Button>
              </div>
            </Form>
          )}
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
