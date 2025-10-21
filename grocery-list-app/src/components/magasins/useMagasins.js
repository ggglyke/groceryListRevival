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
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await MagasinDataService.findManyByCondition({
        user: userId,
      });
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
  }, [userId]);

  const createMagasin = useCallback(
    async (e) => {
      e?.preventDefault();
      if (!userId) {
        toast.error("Vous devez être connecté", { position: "top-right" });
        return;
      }
      try {
        setIsLoading(true);

        const magasinData = {
          user: userId,
          title: `Nouveau magasin`,
          rayonsOrder: [],
        };

        const result = await MagasinDataService.create(magasinData);
        const newMagasinId = result?.data?._id || null;

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
    [userId, navigate]
  );

  useEffect(() => {
    fetchMagasins();
  }, [fetchMagasins]);

  return {
    magasins,
    isLoading,
    error,
    createMagasin,
    refetchMagasins: fetchMagasins,
  };
}
