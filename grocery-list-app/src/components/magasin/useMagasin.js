import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import MagasinDataService from "../../services/magasin.service";
import AisleDataService from "../../services/aisle.service";

export default function useMagasin({ magasinId, userId }) {
  const [magasin, setMagasin] = useState(null);
  const [aisles, setAisles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      const response = await MagasinDataService.get(magasinId, userId);
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
    if (!userId) return;

    try {
      const response = await AisleDataService.getAllUserAisles(userId);
      const aislesData = Array.isArray(response.data) ? response.data : [];
      return aislesData;
    } catch (e) {
      console.error("Error fetching aisles:", e);
      toast.error("Erreur lors du chargement des rayons", {
        position: "top-right",
      });
      return [];
    }
  }, [userId]);

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
      if (!magasinId || !userId) return;

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

        await MagasinDataService.update(magasinId, updatedMagasin, userId);

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
    [magasinId, userId, magasin, aisles, orderAisles]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    magasin,
    aisles,
    isLoading,
    error,
    updateAisleOrder,
  };
}
