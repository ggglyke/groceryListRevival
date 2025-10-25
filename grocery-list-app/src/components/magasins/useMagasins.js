/* React */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/* services */
import MagasinDataService from "../../services/magasin.service";

export default function useMagasins({ userId }) {
  const navigate = useNavigate();
  const [magasins, setMagasins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMagasins = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await MagasinDataService.findManyByCondition({});
      const magasins = Array.isArray(response.data) ? response.data : [];

      setMagasins(magasins);
    } catch (e) {
      console.error("retrieveMagasins error : ", e);
      setError("Impossible de charger les magasins");
      toast.error("Erreur lors du chargement des magasins", {
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createMagasin = useCallback(
    async (e) => {
      e?.preventDefault();
      try {
        setIsLoading(true);

        const magasinData = {
          title: `Nouveau magasin`,
          rayonsOrder: [],
        };

        const result = await MagasinDataService.create(magasinData);
        const newMagasinId = result?.data?.magasin || result?.data._id || null;

        if (newMagasinId) {
          toast.success("Magasin créé avec succès", { position: "top-right" });
          navigate(`/magasin/${newMagasinId}`);
        } else {
          throw new Error("ID de magasin non reçu");
        }
      } catch (err) {
        console.error("Erreur lors de la création du magasin:", err);
        toast.error("Impossible de créer le magasin", {
          position: "top-right",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  const updateMagasin = useCallback(
    async (magasinId, updates) => {
      try {
        await MagasinDataService.update(magasinId, updates);
        toast.success("Magasin mis à jour", { position: "top-right" });
        await fetchMagasins();
        return { success: true };
      } catch (e) {
        console.error("updateMagasin error:", e);
        toast.error("Erreur lors de la mise à jour du magasin", {
          position: "top-right",
        });
        return { success: false };
      }
    },
    [fetchMagasins]
  );

  const deleteMagasin = useCallback(
    async (magasinId) => {
      try {
        await MagasinDataService.delete(magasinId);
        toast.success("Magasin supprimé", { position: "top-right" });
        await fetchMagasins();
        return { success: true };
      } catch (e) {
        console.error("deleteMagasin error:", e);
        toast.error("Erreur lors de la suppression du magasin", {
          position: "top-right",
        });
        return { success: false };
      }
    },
    [fetchMagasins]
  );

  useEffect(() => {
    fetchMagasins();
  }, [fetchMagasins]);

  return {
    magasins,
    isLoading,
    error,
    createMagasin,
    updateMagasin,
    deleteMagasin,
    refetchMagasins: fetchMagasins,
  };
}
