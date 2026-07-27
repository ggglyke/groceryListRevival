import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordInput({
  controlId,
  name,
  placeholder,
  value,
  onChange,
  required,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <InputGroup>
      <Form.Control
        id={controlId}
        required={required}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
      <Button
        variant="outline-secondary"
        className="password-toggle-btn"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={
          visible ? "Masquer le mot de passe" : "Afficher le mot de passe"
        }
      >
        {visible ? <FaEyeSlash /> : <FaEye />}
      </Button>
    </InputGroup>
  );
}
