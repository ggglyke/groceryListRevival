/* React */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/* services */
import ListDataService from "../../services/list.service";
import MagasinDataService from "../../services/magasin.service";

export default function useLists({ userId }) {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLists = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await ListDataService.getAllUserLists();
      const lists = Array.isArray(response.data) ? response.data : [];

      const ordered = [...lists].sort((a, b) => {
        const da = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const db = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return db - da;
      });
      setLists(ordered);
    } catch (e) {
      console.error("retrieveLists error : ", e);
      setError("Impossible de charger les listes");
      toast.error("Erreur lors du chargement des listes", {
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createList = useCallback(
    async (e) => {
      e?.preventDefault();
      try {
        setIsLoading(true);

        const date = new Date().toLocaleString("fr-FR");
        const listData = {
          title: `Liste du ${date}`,
        };

        try {
          const magasinResponse = await MagasinDataService.findOneByCondition({
            default: true,
          });
          if (magasinResponse?.data?._id) {
            listData.magasin = magasinResponse.data._id;
          }
        } catch (magasinErr) {
          console.error("pas de magasin par défaut, on continue  ");
        }

        const result = await ListDataService.create(listData);
        const newListId = result?.data?.list || result?.data?._id || null;

        if (newListId) {
          toast.success("Liste créée avec succès", { position: "top-right" });
          navigate(`/lists/${newListId}`);
        } else {
          throw new Error("ID de liste non reçu");
        }
      } catch (err) {
        console.error("Erreur lors de la création de la liste:", err);
        toast.error("Impossible de créer la liste", {
          position: "top-right",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  return {
    lists,
    isLoading,
    error,
    createList,
    refetchLists: fetchLists,
  };
}
