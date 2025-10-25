import React, { useState } from "react";

import useMagasins from "./useMagasins";
import MagasinItem from "./MagasinItem";
import EmptyMagasins from "./EmptyMagasins";
import Loader from "../ui/Loader";
import PageLayout from "../layout/PageLayout";

export default function Magasins({ userId }) {
  const { magasins, isLoading, error, createMagasin, updateMagasin, deleteMagasin } = useMagasins({ userId });
  const [currentMagasin, setCurrentMagasin] = useState(null);
  const [editMagasinTitle, setEditMagasinTitle] = useState("");

  if (!userId) return <Loader />;
  if (isLoading) return <Loader />;

  return (
    <>
      {magasins.length > 0 ? (
        <PageLayout
          breadcrumbs={[{ label: "Magasins", path: "/magasins" }]}
          title="Vos magasins"
          error={error}
          headerActions={
            <button onClick={createMagasin} className="btn btn-primary">
              Ajouter un magasin
            </button>
          }
        >
          <div className="list-group">
            {magasins.map((magasin) => (
              <MagasinItem
                key={magasin._id}
                magasin={magasin}
                deleteMagasin={deleteMagasin}
                updateMagasin={updateMagasin}
                currentMagasin={currentMagasin}
                setCurrentMagasin={setCurrentMagasin}
                editMagasinTitle={editMagasinTitle}
                setEditMagasinTitle={setEditMagasinTitle}
              />
            ))}
          </div>
        </PageLayout>
      ) : (
        <EmptyMagasins createMagasin={createMagasin} />
      )}
    </>
  );
}
