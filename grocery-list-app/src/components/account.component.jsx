import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import UserDataService from "../services/user.service";
import PasswordInput from "./reusable/PasswordInput";
import PasswordRules from "./reusable/PasswordRules";
import extractPasswordError from "../utils/extractPasswordError";
import AlertModal from "./ui/AlertModal";
import "../scss/login-register.scss";

export default function Account() {
  const navigate = useNavigate();
  const { user, logoutLocal } = useAuth();

  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const generateError = (err) => toast.error(err, { position: "top-right" });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!values.currentPassword || !values.newPassword) {
      return generateError("Veuillez remplir les deux champs");
    }
    setSubmitting(true);
    try {
      const { data } = await UserDataService.changePassword(values);
      if (data?.changed) {
        toast.success("Mot de passe changé avec succès", {
          position: "top-right",
        });
        setValues({ currentPassword: "", newPassword: "" });
      } else {
        const passwordError = extractPasswordError(data?.errors);
        const currentPasswordError = Array.isArray(data?.errors)
          ? null
          : data?.errors?.currentPassword;
        if (passwordError) generateError(passwordError);
        else if (currentPasswordError) generateError(currentPasswordError);
        else generateError("Une erreur est survenue, réessayez");
      }
    } catch (err) {
      const errors = err?.response?.data?.errors;
      if (errors) {
        const passwordError = extractPasswordError(errors);
        const currentPasswordError = Array.isArray(errors)
          ? null
          : errors.currentPassword;
        if (passwordError) generateError(passwordError);
        else if (currentPasswordError) generateError(currentPasswordError);
        else generateError("Une erreur est survenue, réessayez");
      } else {
        console.error(err);
        generateError("Erreur réseau, réessayez");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await UserDataService.deleteMyAccount();
      logoutLocal();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
      generateError("Erreur lors de la suppression du compte, réessayez");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="container ">
      <div className="row d-flex justify-content-center ">
        <div className="col-sm-12 col-md-8 col-lg-6 mt-3 form-container px-5 py-4 d-flex flex-column">
          <div className="img-container">
            <img src="./logo192.png" alt="" />
          </div>
          <h2 className="mt-4 mb-2 text-center">Mon compte</h2>
          {user?.username && (
            <p className="text-center text-muted mb-4">{user.username}</p>
          )}

          <Form onSubmit={handleChangePassword}>
            <h5 className="mb-3">Changer le mot de passe</h5>
            <Form.Group controlId="currentPassword" className="mb-3">
              <Form.Label>
                Mot de passe actuel <span className="text-danger">*</span>
              </Form.Label>
              <PasswordInput
                controlId="currentPassword"
                placeholder="Mot de passe actuel"
                name="currentPassword"
                value={values.currentPassword}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="newPassword">
              <Form.Label>
                Nouveau mot de passe <span className="text-danger">*</span>
              </Form.Label>
              <PasswordInput
                controlId="newPassword"
                placeholder="Nouveau mot de passe"
                name="newPassword"
                value={values.newPassword}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
              <PasswordRules password={values.newPassword} />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button
                variant="primary"
                type="submit"
                className="my-4"
                disabled={submitting}
              >
                Changer le mot de passe
              </Button>
            </div>
          </Form>

          <hr className="my-3" />

          <h5 className="mb-3 text-danger">Zone de danger</h5>
          <div className="d-grid gap-2">
            <Button
              variant="outline-danger"
              onClick={() => setShowDeleteModal(true)}
              disabled={deleting}
            >
              Supprimer mon compte
            </Button>
          </div>
        </div>
      </div>

      <AlertModal
        show={showDeleteModal}
        title="Supprimer mon compte"
        message="Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible et supprimera aussi toutes vos listes, produits, magasins et rayons."
        confirmButtonText="Oui, supprimer mon compte"
        variant="danger"
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />

      <ToastContainer />
    </div>
  );
}
