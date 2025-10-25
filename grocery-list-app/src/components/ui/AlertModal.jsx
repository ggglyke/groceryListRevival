import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function AlertModal({
  show,
  title,
  message,
  confirmButtonText,
  variant = "primary",
  onClose,
  onConfirm,
}) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <b>{title}</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant={`outline-${variant}`} onClick={onClose}>
          Annuler
        </Button>
        <Button variant={variant} onClick={onConfirm}>
          {confirmButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
