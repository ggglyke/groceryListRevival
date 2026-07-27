import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import UserDataService from "../services/user.service";
import "../scss/login-register.scss";

export default function VerifyEmail() {
  const location = useLocation();

  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const token = query.get("token");

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Lien invalide, veuillez refaire une demande");
      return;
    }
    UserDataService.verifyEmail(token)
      .then(({ data }) => {
        if (data?.verified) {
          setStatus("success");
        } else {
          setStatus("error");
          setMessage(data?.message || "Lien invalide ou expiré");
        }
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err?.response?.data?.message || "Lien invalide ou expiré"
        );
      });
  }, [token]);

  return (
    <div className="container ">
      <div className="row d-flex justify-content-center ">
        <div className="col-sm-12 col-md-8 col-lg-6 mt-3 form-container px-5 py-4 d-flex flex-column">
          <div className="img-container">
            <img src="./logo192.png" alt="" />
          </div>
          <h2 className="mt-4 mb-5 text-center">Vérification de l'email</h2>

          {status === "loading" && (
            <p className="text-center">Vérification en cours...</p>
          )}

          {status === "success" && (
            <p className="text-center">
              Votre email a été vérifié avec succès. Vous pouvez maintenant{" "}
              <Link to="/login">vous connecter</Link>.
            </p>
          )}

          {status === "error" && (
            <>
              <p className="text-center text-danger">{message}</p>
              <p className="text-center">
                <Link to="/login">Retour à la connexion</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
