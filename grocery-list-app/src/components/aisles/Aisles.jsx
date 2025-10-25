import React from "react";

import useAisles from "./useAisles";
import AisleForm from "./AisleForm";
import AisleList from "./AisleList";
import EmptyAisles from "./EmptyAisles";
import Loader from "../ui/Loader";
import PageLayout from "../layout/PageLayout";

export default function Aisles({ userId }) {
  const {
    aisles,
    isLoading,
    error,
    currentAisle,
    setCurrentAisle,
    editAisleTitle,
    setEditAisleTitle,
    createAisle,
    updateAisle,
    deleteAisle,
    deleteAllAisles,
  } = useAisles({ userId });

  if (!userId) return <Loader />;
  if (isLoading) return <Loader />;

  // Condition pour afficher EmptyAisles
  const hasOnlyDefaultAisle = aisles.length === 1 && aisles[0]?.isDefault;
  const hasNoCustomAisles = aisles.length === 0 || hasOnlyDefaultAisle;

  return (
    <PageLayout
      breadcrumbs={[{ label: "Rayons", path: "/aisles" }]}
      title="Rayons"
      error={error}
    >
      {/* Formulaire de création toujours visible */}
      <AisleForm createAisle={createAisle} />

      {/* Liste des rayons ou état vide */}
      {hasNoCustomAisles ? (
        <EmptyAisles />
      ) : (
        <AisleList
          aisles={aisles}
          deleteAisle={deleteAisle}
          updateAisle={updateAisle}
          deleteAllAisles={deleteAllAisles}
          currentAisle={currentAisle}
          setCurrentAisle={setCurrentAisle}
          editAisleTitle={editAisleTitle}
          setEditAisleTitle={setEditAisleTitle}
        />
      )}
    </PageLayout>
  );
}
