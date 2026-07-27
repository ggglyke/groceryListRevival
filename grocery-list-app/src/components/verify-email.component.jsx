import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import confetti from "canvas-confetti";
import UserDataService from "../services/user.service";
import AnimatedCheckmark from "./reusable/AnimatedCheckmark";
import "../scss/login-register.scss";

// Même animation que la célébration de liste complétée (List.jsx)
const launchConfetti = (origin) => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      particleCount,
      startVelocity: 30,
      spread: 360,
      origin,
      colors: [
        "#26ccff",
        "#a25afd",
        "#ff5e7e",
        "#88ff5a",
        "#fcff42",
        "#ffa62d",
        "#ff36ff",
      ],
      zIndex: 9999,
    });
  }, 250);
};

export default function VerifyEmail() {
  const location = useLocation();

  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const token = query.get("token");

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const hasCelebratedRef = useRef(false);

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
        setMessage(err?.response?.data?.message || "Lien invalide ou expiré");
      });
  }, [token]);

  useEffect(() => {
    if (status === "success" && !hasCelebratedRef.current) {
      hasCelebratedRef.current = true;
      launchConfetti({ x: 0.5, y: 0.4 });
    }
  }, [status]);

  return (
    <div className="container ">
      <div className="row d-flex justify-content-center ">
        <div className="col-sm-12 col-md-8 col-lg-6 mt-3 form-container px-5 py-4 d-flex flex-column">
          <div
            className={`img-container ${status === "success" ? "img-container--plain" : ""}`}
          >
            {status === "success" ? (
              <AnimatedCheckmark />
            ) : (
              <img src="./logo192.png" alt="" />
            )}
          </div>

          {status === "loading" && (
            <>
              <h2 className="mt-4 mb-5 text-center">Vérification de l'email</h2>
              <p className="text-center">Vérification en cours...</p>
            </>
          )}

          {status === "success" && (
            <>
              <h2 className="mt-4 mb-5 text-center">Compte vérifié</h2>
              <p className="text-center">
                Votre email a été vérifié avec succès.
                <br /> Vous pouvez maintenant{" "}
                <Link to="/login">vous connecter</Link>.
              </p>
            </>
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
