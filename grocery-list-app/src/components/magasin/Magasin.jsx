import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import useMagasin from "./useMagasin";
import MagasinHeader from "./MagasinHeader";
import AisleOrderList from "./AisleOrderList";
import Loader from "../ui/Loader";
import PageLayout from "../layout/PageLayout";

export default function Magasin({ userId }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    magasin,
    aisles,
    isLoading,
    error,
    magasinDeleted,
    updateAisleOrder,
    updateMagasinTitle,
    deleteMagasin,
  } = useMagasin({
    magasinId: id,
    userId,
  });

  const handleDragEnd = (result) => {
    // Si pas de destination (dropped outside), on ne fait rien
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // Si même position, on ne fait rien
    if (sourceIndex === destinationIndex) return;

    // Créer le nouveau tableau d'IDs dans le bon ordre
    const aisleIds = aisles.map((aisle) => aisle._id);
    const [movedId] = aisleIds.splice(sourceIndex, 1);
    aisleIds.splice(destinationIndex, 0, movedId);

    // Sauvegarder le nouvel ordre
    updateAisleOrder(aisleIds);
  };

  // Redirect to magasins list after deletion
  useEffect(() => {
    if (magasinDeleted) {
      navigate("/magasins");
    }
  }, [magasinDeleted, navigate]);

  if (!userId) return <Loader />;
  if (isLoading) return <Loader />;

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Magasins", path: "/magasins" },
        { label: magasin?.title || "Chargement..." },
      ]}
      error={error}
    >
      <MagasinHeader
        magasin={magasin}
        updateMagasinTitle={updateMagasinTitle}
        onDeleteMagasin={deleteMagasin}
      />
      <AisleOrderList aisles={aisles} onDragEnd={handleDragEnd} />
    </PageLayout>
  );
}
