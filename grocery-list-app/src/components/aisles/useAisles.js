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
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await AisleDataService.getAllUserAisles(userId);
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
  }, [userId]);

  // Create aisle
  const createAisle = useCallback(
    async (aisleData) => {
      if (!userId) {
        toast.error("Vous devez être connecté", { position: "top-right" });
        return;
      }

      try {
        const data = {
          userId: userId,
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
    [userId, fetchAisles]
  );

  // Update aisle
  const updateAisle = useCallback(
    async (aisleId, aisleData) => {
      if (!userId) {
        toast.error("Vous devez être connecté", { position: "top-right" });
        return;
      }

      try {
        const data = {
          title: aisleData.title,
          user: userId,
        };

        await AisleDataService.update(aisleId, data, userId);
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
    [userId, fetchAisles]
  );

  // Delete aisle
  const deleteAisle = useCallback(
    async (aisleId) => {
      if (!userId) {
        toast.error("Vous devez être connecté", { position: "top-right" });
        return;
      }

      try {
        await AisleDataService.delete(aisleId, userId);
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
    [userId, fetchAisles]
  );

  // Delete all aisles
  const deleteAllAisles = useCallback(async () => {
    if (!userId) {
      toast.error("Vous devez être connecté", { position: "top-right" });
      return;
    }

    try {
      await AisleDataService.deleteAll(userId);
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
  }, [userId, fetchAisles]);

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
