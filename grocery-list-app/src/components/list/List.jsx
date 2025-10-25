import React, { useState, useEffect, useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import confetti from "canvas-confetti";
import useList from "./useList";
import ListHeader from "./ListHeader";
import ProductSearchBar from "./ProductSearchBar";
import ProductsByAisle from "./ProductsByAisle";
import Loader from "../ui/Loader";
import PageLayout from "../layout/PageLayout";
import AlertModal from "../ui/AlertModal";

export default function List({ userId }) {
  const { id } = useParams();
  const {
    list,
    aisles,
    dbProducts,
    magasins,
    rayonList,
    isLoading,
    error,
    listDeleted,
    toggleCheck,
    removeProductFromList,
    renameProduct,
    addProductToList,
    addCustomProductToList,
    deleteAllCheckedProducts,
    deleteAllProducts,
    updateListTitle,
    changeMagasin,
    deleteList,
  } = useList({ listId: id, userId });

  const [showDeleteCheckedModal, setShowDeleteCheckedModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showDeleteListModal, setShowDeleteListModal] = useState(false);

  // Track if we've already celebrated (to avoid multiple confetti on re-renders)
  const hasCelebratedRef = useRef(false);
  const celebrationTextRef = useRef(null);

  // Trigger confetti when all products are checked
  useEffect(() => {
    if (!list) return;

    const totalProducts = (list.products?.length || 0) + (list.customProducts?.length || 0);
    const checkedCount = list.checkedProducts?.length || 0;

    // All products checked AND there's at least 1 product AND we haven't celebrated yet
    if (totalProducts > 0 && checkedCount === totalProducts && !hasCelebratedRef.current) {
      hasCelebratedRef.current = true;

      // Wait a bit for the celebration text to render, then trigger confetti
      setTimeout(() => {
        if (!celebrationTextRef.current) {
          // Fallback if ref is not available: center of screen
          launchConfetti({ x: 0.5, y: 0.4 });
          return;
        }

        // Calculate position of celebration text
        const rect = celebrationTextRef.current.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        launchConfetti({ x, y });
      }, 100);
    }

    // Reset celebration flag when products are unchecked
    if (checkedCount < totalProducts) {
      hasCelebratedRef.current = false;
    }
  }, [list]);

  // Confetti animation function
  const launchConfetti = (origin) => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      // Confetti from celebration text position, spreading in all directions
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin,
        colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
        zIndex: 9999
      });
    }, 250);
  };

  if (!userId) return <Loader />;
  if (listDeleted) return <Navigate to="/lists" replace={true} />;
  if (isLoading) return <Loader />;

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Listes", path: "/lists" },
        { label: list?.title || "Chargement..." },
      ]}
      error={error}
    >
      <ListHeader
        list={list}
        magasins={magasins}
        updateListTitle={updateListTitle}
        changeMagasin={changeMagasin}
        onDeleteCheckedProducts={() => setShowDeleteCheckedModal(true)}
        onDeleteAllProducts={() => setShowDeleteAllModal(true)}
        onDeleteList={() => setShowDeleteListModal(true)}
      />

      <ProductSearchBar
        dbProducts={dbProducts}
        aisles={aisles}
        list={list}
        productsInList={list?.products?.map((p) => p._id) || []}
        checkedProducts={list?.checkedProducts || []}
        onAddProductToList={addProductToList}
        onAddCustomProductToList={addCustomProductToList}
      />

      <ProductsByAisle
        rayonList={rayonList}
        list={list}
        dbProducts={dbProducts}
        onToggleCheck={toggleCheck}
        onRenameProduct={renameProduct}
        onRemoveProduct={removeProductFromList}
        onAddProductToList={addProductToList}
        celebrationTextRef={celebrationTextRef}
      />

      {/* Alert Modals */}
      <AlertModal
        show={showDeleteCheckedModal}
        title="Un peu de ménage ?"
        message={`Voulez-vous vraiment supprimer tous les produits déjà cochés de la liste (${
          list?.checkedProducts?.length || 0
        } ${list?.checkedProducts?.length > 1 ? "produits" : "produit"}) ?`}
        confirmButtonText="Oui, supprimer les produits cochés"
        variant="primary"
        onClose={() => setShowDeleteCheckedModal(false)}
        onConfirm={() => {
          deleteAllCheckedProducts();
          setShowDeleteCheckedModal(false);
        }}
      />

      <AlertModal
        show={showDeleteAllModal}
        title="Mer il é fou ! 😱"
        message={
          <>
            Voulez-vous vraiment supprimer tous les produits de la liste ?
            <br />
            <br />
            Nombre de produit(s) :{" "}
            {(list?.products?.length || 0) + (list?.customProducts?.length || 0)}
          </>
        }
        confirmButtonText="Oui, vider la liste"
        variant="danger"
        onClose={() => setShowDeleteAllModal(false)}
        onConfirm={() => {
          deleteAllProducts();
          setShowDeleteAllModal(false);
        }}
      />

      <AlertModal
        show={showDeleteListModal}
        title="Mer il é fou ! 😱"
        message="Voulez-vous vraiment supprimer la liste ?"
        confirmButtonText="Oui, supprimer la liste"
        variant="danger"
        onClose={() => setShowDeleteListModal(false)}
        onConfirm={() => {
          deleteList();
          setShowDeleteListModal(false);
        }}
      />
    </PageLayout>
  );
}
