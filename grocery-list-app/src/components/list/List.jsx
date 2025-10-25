import React, { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
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
