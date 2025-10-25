import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { FaPen, FaTimes, FaCheck } from "react-icons/fa";

export default function ProductItem({
  product,
  isChecked,
  isCustomProduct,
  onToggleCheck,
  onRenameProduct,
  onRemoveProduct,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleEdit = () => {
    // Get the current display name (customName or title)
    const currentName = product.customName || product.title;
    setEditValue(currentName);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValue("");
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!editValue.trim()) return;

    await onRenameProduct(product._id, editValue, isCustomProduct);
    setIsEditing(false);
    setEditValue("");
  };

  const handleDelete = () => {
    onRemoveProduct(product._id, isCustomProduct);
  };

  const handleCheck = () => {
    // Si déjà en animation, ne rien faire
    if (isAnimating) return;

    // Si le produit est déjà coché, décoche immédiatement sans animation
    if (isChecked) {
      onToggleCheck(product._id);
      return;
    }

    // Produit non coché → coché : déclencher l'animation
    setIsAnimating(true);

    // Attendre la fin de l'animation avant de déplacer le produit
    setTimeout(() => {
      onToggleCheck(product._id);
      setIsAnimating(false);
    }, 600);
  };

  // Display name: customName if exists, otherwise title
  const displayName = product.customName || product.title;

  return (
    <li
      className={`list-group-item py-2 product d-flex justify-content-between align-items-center${
        isChecked ? " checked" : ""
      }${isAnimating ? " animating-check" : ""}`}
    >
      {isEditing ? (
        <Form
          onSubmit={handleSubmitEdit}
          className="my-2 d-flex justify-content-between flex-fill"
        >
          <Form.Group className="flex-fill" controlId="changeProductName">
            <Form.Control
              type="text"
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </Form.Group>

          <div className="ms-2 d-flex align-items-center">
            <button type="submit" className="btn btn-primary btn-sm me-2">
              <FaCheck />
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={handleCancelEdit}
            >
              <FaTimes />
            </button>
          </div>
        </Form>
      ) : (
        <>
          <div className="d-flex align-items-center flex-grow-1">
            <div className="check-area d-flex" onClick={handleCheck}>
              <div className="tick"></div>
            </div>
            <span className="product-title">{displayName}</span>
          </div>
          <div className="d-flex">
            <div className="icon-container edit" onClick={handleEdit}>
              <FaPen />
            </div>
            <div className="icon-container delete" onClick={handleDelete}>
              <FaTimes />
            </div>
          </div>
        </>
      )}
    </li>
  );
}
