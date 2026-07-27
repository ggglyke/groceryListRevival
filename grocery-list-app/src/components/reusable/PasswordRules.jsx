import React from "react";
import { FaCheck, FaTimes, FaCircle } from "react-icons/fa";
import "./PasswordRules.scss";

const RULES = [
  { label: "Au moins 8 caractères", test: (pw) => pw.length >= 8 },
  { label: "Une majuscule", test: (pw) => /[A-Z]/.test(pw) },
  { label: "Une minuscule", test: (pw) => /[a-z]/.test(pw) },
  { label: "Un chiffre", test: (pw) => /[0-9]/.test(pw) },
  {
    label: "Un caractère spécial (! @ # $ % ...)",
    test: (pw) => /[^a-zA-Z0-9]/.test(pw),
  },
];

export default function PasswordRules({ password = "" }) {
  const untouched = password.length === 0;

  return (
    <div className="password-rules mb-1">
      <p className="password-rules__intro mb-1">Le mot de passe doit contenir :</p>
      <ul className="password-rules__list list-unstyled mb-0">
        {RULES.map(({ label, test }) => {
          const valid = test(password);
          const state = untouched
            ? "neutral"
            : valid
            ? "valid"
            : "invalid";
          return (
            <li key={label} className={`password-rules__item password-rules__item--${state}`}>
              {state === "neutral" ? (
                <FaCircle className="password-rules__bullet" />
              ) : state === "valid" ? (
                <FaCheck />
              ) : (
                <FaTimes />
              )}
              <span>{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
