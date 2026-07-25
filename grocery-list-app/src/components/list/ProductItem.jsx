import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { FaPen, FaTimes, FaCheck, FaLink } from "react-icons/fa";

// Extrait le domaine (sans "www.") d'une URL pour l'affichage
const formatLink = (url) => {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

export default function ProductItem({
  product,
  isChecked,
  isCustomProduct,
  showLinkPrice = false,
  onToggleCheck,
  onRenameProduct,
  onRemoveProduct,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleEdit = () => {
    // Get the current display name (customName or title)
    const currentName = product.customName || product.title;
    setEditValue(currentName);
    setEditLink(product.link || "");
    setEditPrice(product.price ?? "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValue("");
    setEditLink("");
    setEditPrice("");
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!editValue.trim()) return;

    await onRenameProduct(
      product._id,
      editValue,
      isCustomProduct,
      showLinkPrice
        ? {
            link: editLink.trim() || undefined,
            price: editPrice !== "" ? Number(editPrice) : undefined,
          }
        : {}
    );
    setIsEditing(false);
    setEditValue("");
    setEditLink("");
    setEditPrice("");
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
          <div className="flex-fill">
            <Form.Group className="mb-2" controlId="changeProductName">
              <Form.Control
                type="text"
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Nom"
              />
            </Form.Group>
            {showLinkPrice && (
              <div className="d-flex gap-2">
                <Form.Group className="flex-fill" controlId="changeProductLink">
                  <Form.Control
                    type="url"
                    value={editLink}
                    onChange={(e) => setEditLink(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Lien (optionnel)"
                  />
                </Form.Group>
                <Form.Group
                  controlId="changeProductPrice"
                  style={{ maxWidth: "110px" }}
                >
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Prix €"
                  />
                </Form.Group>
              </div>
            )}
          </div>

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
          <div
            className="d-flex align-items-center flex-grow-1"
            style={{ minWidth: 0 }}
          >
            <div className="check-area d-flex" onClick={handleCheck}>
              <div className="tick"></div>
            </div>
            <div className="d-flex flex-column" style={{ minWidth: 0 }}>
              <span className="product-title" title={displayName}>
                {displayName}
              </span>
              {showLinkPrice && (product.link || typeof product.price === "number") && (
                <div className="d-flex align-items-center mt-1">
                  {product.link && (
                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="product-link text-small me-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaLink className="me-1" />
                      {formatLink(product.link)}
                    </a>
                  )}
                  {typeof product.price === "number" && (
                    <span className="product-price text-muted text-small">
                      {product.price.toFixed(2).replace(".", ",")}€
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="d-flex align-items-center">
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
