import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import AisleDataService from "../../services/aisle.service";

export default function useAisles({ userId }) {
  const [aisles, setAisles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAisle, setCurrentAisle] = useState(null);
  const [editAisleTitle, setEditAisleTitle] = useState("");

  // Fetch aisles
  const fetchAisles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await AisleDataService.getAllUserAisles();
      const aisles = Array.isArray(response.data) ? response.data : [];
      setAisles(aisles);
    } catch (e) {
      console.error("retrieveAisles error : ", e);
      setError("Impossible de charger les rayons");
      toast.error("Erreur lors du chargement des rayons", {
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create aisle
  const createAisle = useCallback(
    async (aisleData) => {
      try {
        const data = {
          title: aisleData.title,
          isDefault: false,
        };

        const response = await AisleDataService.create(data);

        if (response.data) {
          toast.success("Rayon créé avec succès !", {
            position: "top-right",
          });
          await fetchAisles();
          return { success: true };
        }
      } catch (err) {
        console.error("Erreur lors de la création du rayon : ", err);
        toast.error("Impossible de créer le rayon.", {
          position: "top-right",
        });
        return { success: false };
      }
    },
    [fetchAisles]
  );

  // Update aisle
  const updateAisle = useCallback(
    async (aisleId, aisleData) => {
      try {
        const data = {
          title: aisleData.title,
        };

        await AisleDataService.update(aisleId, data);
        toast.success("Rayon mis à jour !", { position: "top-right" });
        setCurrentAisle(null);
        setEditAisleTitle("");
        await fetchAisles();
        return { success: true };
      } catch (err) {
        console.error("Erreur lors de la mise à jour du rayon", err);
        toast.error("Impossible de mettre à jour le rayon", {
          position: "top-right",
        });
        return { success: false };
      }
    },
    [fetchAisles]
  );

  // Delete aisle
  const deleteAisle = useCallback(
    async (aisleId) => {
      try {
        await AisleDataService.delete(aisleId);
        toast.success("Rayon supprimé", { position: "top-right" });
        await fetchAisles();
        return { success: true };
      } catch (err) {
        console.error("Erreur lors de la suppression du rayon", err);
        toast.error("Impossible de supprimer le rayon", {
          position: "top-right",
        });
        return { success: false };
      }
    },
    [fetchAisles]
  );

  // Delete all aisles
  const deleteAllAisles = useCallback(async () => {
    try {
      await AisleDataService.deleteAll();
      toast.success("Rayons supprimés", { position: "top-right" });
      await fetchAisles();
      return { success: true };
    } catch (err) {
      console.error("Erreur lors de la suppression des rayons", err);
      toast.error("Impossible de supprimer les rayons", {
        position: "top-right",
      });
      return { success: false };
    }
  }, [fetchAisles]);

  useEffect(() => {
    fetchAisles();
  }, [fetchAisles]);

  return {
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
  };
}
