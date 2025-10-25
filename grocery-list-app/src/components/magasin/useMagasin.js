import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import MagasinDataService from "../../services/magasin.service";
import AisleDataService from "../../services/aisle.service";

export default function useMagasin({ magasinId, userId }) {
  const [magasin, setMagasin] = useState(null);
  const [aisles, setAisles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [magasinDeleted, setMagasinDeleted] = useState(false);

  // Order aisles based on magasin.rayonsOrder
  const orderAisles = useCallback((aislesData, rayonsOrder) => {
    if (!rayonsOrder || rayonsOrder.length === 0) {
      return aislesData;
    }

    const orderedAisles = [...aislesData].sort((a, b) => {
      const indexA = rayonsOrder.indexOf(a._id);
      const indexB = rayonsOrder.indexOf(b._id);

      // Si un rayon n'est pas dans rayonsOrder, le mettre à la fin
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });

    return orderedAisles;
  }, []);

  // Fetch magasin details
  const fetchMagasin = useCallback(async () => {
    if (!magasinId) return;

    try {
      const response = await MagasinDataService.get(magasinId);
      setMagasin(response.data);
      return response.data;
    } catch (e) {
      console.error("Error fetching magasin:", e);
      setError("Impossible de charger le magasin");
      toast.error("Erreur lors du chargement du magasin", {
        position: "top-right",
      });
    }
  }, [magasinId]);

  // Fetch aisles
  const fetchAisles = useCallback(async () => {
    try {
      const response = await AisleDataService.getAllUserAisles();
      const aislesData = Array.isArray(response.data) ? response.data : [];
      return aislesData;
    } catch (e) {
      console.error("Error fetching aisles:", e);
      toast.error("Erreur lors du chargement des rayons", {
        position: "top-right",
      });
      return [];
    }
  }, []);

  // Fetch both magasin and aisles, then order them
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [magasinData, aislesData] = await Promise.all([
        fetchMagasin(),
        fetchAisles(),
      ]);

      if (magasinData && aislesData) {
        const orderedAisles = orderAisles(aislesData, magasinData.rayonsOrder);
        setAisles(orderedAisles);
      }
    } catch (e) {
      console.error("Error fetching data:", e);
      setError("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  }, [fetchMagasin, fetchAisles, orderAisles]);

  // Update aisle order
  const updateAisleOrder = useCallback(
    async (newOrder) => {
      if (!magasinId) return;

      // Optimistic update - mettre à jour l'UI immédiatement
      const previousAisles = [...aisles];
      const previousMagasin = { ...magasin };

      const orderedAisles = orderAisles(aisles, newOrder);
      setAisles(orderedAisles);
      setMagasin({
        ...magasin,
        rayonsOrder: newOrder,
      });

      try {
        const updatedMagasin = {
          ...magasin,
          rayonsOrder: newOrder,
        };

        await MagasinDataService.update(magasinId, updatedMagasin);

        return { success: true };
      } catch (err) {
        console.error("Error updating aisle order:", err);

        // Rollback en cas d'erreur
        setAisles(previousAisles);
        setMagasin(previousMagasin);

        toast.error("Impossible de sauvegarder l'ordre des rayons", {
          position: "top-right",
        });
        return { success: false };
      }
    },
    [magasinId, magasin, aisles, orderAisles]
  );

  // Update magasin title
  const updateMagasinTitle = useCallback(
    async (newTitle) => {
      if (!magasinId || !newTitle.trim()) return;

      const previousMagasin = { ...magasin };

      try {
        const updatedMagasin = {
          ...magasin,
          title: newTitle,
        };

        // Optimistic update
        setMagasin(updatedMagasin);

        // Backend update
        await MagasinDataService.update(magasinId, updatedMagasin);

        toast.success("Magasin renommé", {
          position: "top-right",
        });

        return { success: true };
      } catch (e) {
        console.error("Error updating magasin title:", e);
        toast.error("Erreur lors du renommage du magasin", {
          position: "top-right",
        });
        // Rollback on error
        setMagasin(previousMagasin);
        return { success: false };
      }
    },
    [magasinId, magasin]
  );

  // Delete magasin
  const deleteMagasin = useCallback(async () => {
    if (!magasinId) return;

    try {
      await MagasinDataService.delete(magasinId);
      setMagasinDeleted(true);
      toast.success("Magasin supprimé", {
        position: "top-right",
      });
    } catch (e) {
      console.error("Error deleting magasin:", e);
      toast.error("Erreur lors de la suppression du magasin", {
        position: "top-right",
      });
    }
  }, [magasinId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    magasin,
    aisles,
    isLoading,
    error,
    magasinDeleted,
    updateAisleOrder,
    updateMagasinTitle,
    deleteMagasin,
    setMagasinDeleted,
  };
}
