import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Form, Button } from "react-bootstrap";
import SearchBar from "../reusable/searchbar.component";

export default function ProductSearchBar({
  dbProducts,
  aisles,
  list,
  productsInList,
  checkedProducts,
  onAddProductToList,
  onAddCustomProductToList,
}) {
  const [showModal, setShowModal] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductAisle, setNewProductAisle] = useState("");
  const [alsoAddToDatabase, setAlsoAddToDatabase] = useState(false);

  // Trier les rayons par ordre alphab�tique
  const sortedAisles = [...aisles].sort((a, b) =>
    a.title.localeCompare(b.title, "fr", { sensitivity: "base" })
  );

  const handleClickResult = (e) => {
    const productId = e.currentTarget.dataset.id;
    onAddProductToList(productId);
    setNewProductName(""); // Reset search
  };

  const handleQuickAdd = () => {
    const defaultAisle = aisles.find((a) => a.isDefault);
    if (defaultAisle && newProductName.trim()) {
      onAddCustomProductToList(newProductName, defaultAisle._id, alsoAddToDatabase);
      setNewProductName("");
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewProductAisle("");
    setAlsoAddToDatabase(false);
  };

  const handleSubmitNewProduct = async (e) => {
    e.preventDefault();

    if (!newProductName.trim() || !newProductAisle) {
      alert("Entrez un nom de produit et choisissez un rayon");
      return;
    }

    onAddCustomProductToList(newProductName, newProductAisle, alsoAddToDatabase);

    setNewProductName("");
    setNewProductAisle("");
    setAlsoAddToDatabase(false);
    setShowModal(false);
  };

  return (
    <>
      <div className="search-autocomplete my-4">
        <SearchBar
          placeholder="ex : Bananes"
          dbProducts={dbProducts}
          listHasAisles={list?.hasAisles}
          productsInList={productsInList}
          checkedProducts={checkedProducts}
          onClickResult={handleClickResult}
          handleOpen={handleOpenModal}
          quickAdd={handleQuickAdd}
          handleChangeNewProductName={(e) => setNewProductName(e.target.value)}
          newProductName={newProductName}
        />
      </div>

      {/* Modal pour ajouter un nouveau produit */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Ajouter &laquo;<span className="fw-bold">{newProductName}</span>
            &raquo; � la liste
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitNewProduct}>
          <Modal.Body>
            <Form.Group controlId="productName" className="mb-3">
              <Form.Label className="fw-bold">
                Nom du nouveau produit :
              </Form.Label>
              <Form.Control
                type="text"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="newProductAisle" className="mb-3">
              <Form.Label className="fw-bold">Rayon :</Form.Label>
              <Form.Select
                required
                onChange={(e) => setNewProductAisle(e.target.value)}
                value={newProductAisle}
              >
                <option value="">Choisir un rayon</option>
                {sortedAisles.map((aisle) => (
                  <option key={aisle._id} value={aisle._id}>
                    {aisle.title}
                  </option>
                ))}
              </Form.Select>
              {aisles.length < 1 ? (
                <Form.Text className="text-small text-danger ms-2">
                  <span className="font-weight-bold">
                    Vous n'avez configur� aucun rayon.
                  </span>{" "}
                  <Link to="/aisles">Configurer</Link>
                </Form.Text>
              ) : (
                <Form.Text className="text-small text-muted ms-2">
                  <Link to="/aisles">G�rer les rayons</Link>
                </Form.Text>
              )}
            </Form.Group>
            <Form.Check
              checked={alsoAddToDatabase}
              type="checkbox"
              id="custom-switch"
              label="Ajouter �galement � la base de produits"
              onChange={(e) => setAlsoAddToDatabase(e.target.checked)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleCloseModal}>
              Fermer
            </Button>
            <Button variant="primary" type="submit">
              Ajouter
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
