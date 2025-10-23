import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import ListDataService from "../../services/list.service";
import ProductDataService from "../../services/product.service";
import AisleDataService from "../../services/aisle.service";
import MagasinDataService from "../../services/magasin.service";

export default function useList({ listId, userId }) {
  // States
  const [list, setList] = useState(null);
  const [aisles, setAisles] = useState([]);
  const [dbProducts, setDbProducts] = useState([]);
  const [magasins, setMagasins] = useState([]);
  const [productsToDisplay, setProductsToDisplay] = useState([]);
  const [rayonList, setRayonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listDeleted, setListDeleted] = useState(false);

  const navigate = useNavigate();

  // Fetch list
  const fetchList = useCallback(async () => {
    if (!listId) return;

    try {
      const response = await ListDataService.get(listId, userId);
      const listData = response.data;
      setList(listData);
      return listData;
    } catch (e) {
      console.error("Error fetching list:", e);
      setError("Impossible de charger la liste");
      toast.error("Erreur lors du chargement de la liste", {
        position: "top-right",
      });
    }
  }, [listId]);

  // Fetch aisles
  const fetchAisles = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await AisleDataService.getAllUserAisles(userId);
      const aislesData = Array.isArray(response.data) ? response.data : [];
      setAisles(aislesData);
      return aislesData;
    } catch (e) {
      console.error("Error fetching aisles:", e);
      toast.error("Erreur lors du chargement des rayons", {
        position: "top-right",
      });
      return [];
    }
  }, [userId]);

  // Fetch products from database
  const fetchDbProducts = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await ProductDataService.getAllUserProducts(userId);
      const products = Array.isArray(response.data) ? response.data : [];
      setDbProducts(products);
      return products;
    } catch (e) {
      console.error("Error fetching products:", e);
      toast.error("Erreur lors du chargement des produits", {
        position: "top-right",
      });
      return [];
    }
  }, [userId]);

  // Fetch magasins
  const fetchMagasins = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await MagasinDataService.findManyByCondition({
        user: userId,
      });
      const magasinsData = Array.isArray(response.data) ? response.data : [];
      setMagasins(magasinsData);
      return magasinsData;
    } catch (e) {
      console.error("Error fetching magasins:", e);
      toast.error("Erreur lors du chargement des magasins", {
        position: "top-right",
      });
      return [];
    }
  }, [userId]);

  // Order products by aisle based on magasin.rayonsOrder
  const orderProducts = useCallback((products, magasin, aislesData) => {
    if (!magasin || !magasin.rayonsOrder || !aislesData) {
      return products;
    }

    const rayonsOrder = magasin.rayonsOrder;
    const defaultAisle = aislesData.find((a) => a.isDefault);

    // Group products by aisle
    const productsByAisle = {};
    const rayonListTemp = [];

    products.forEach((product) => {
      // Gérer les produits avec rayon supprimé -> mettre dans rayon par défaut
      let aisleId = product.rayon?._id || product.rayon;
      const aisleExists = aislesData.find((a) => a._id === aisleId);

      if (!aisleExists && defaultAisle) {
        // Rayon supprimé ou inexistant -> utiliser le rayon par défaut
        aisleId = defaultAisle._id;
      }

      if (!productsByAisle[aisleId]) {
        productsByAisle[aisleId] = [];
      }
      productsByAisle[aisleId].push(product);
    });

    // Create rayonList sorted by rayonsOrder
    const orderedRayonList = [];

    rayonsOrder.forEach((rayonId) => {
      const aisle = aislesData.find((a) => a._id === rayonId);
      if (
        aisle &&
        productsByAisle[rayonId] &&
        productsByAisle[rayonId].length > 0
      ) {
        orderedRayonList.push({
          _id: aisle._id,
          title: aisle.title,
          products: productsByAisle[rayonId],
        });
      }
    });

    // Add aisles not in rayonsOrder (including orphaned products in default aisle)
    aislesData.forEach((aisle) => {
      if (
        !rayonsOrder.includes(aisle._id) &&
        productsByAisle[aisle._id] &&
        productsByAisle[aisle._id].length > 0
      ) {
        orderedRayonList.push({
          _id: aisle._id,
          title: aisle.title,
          products: productsByAisle[aisle._id],
        });
      }
    });

    return orderedRayonList;
  }, []);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [listData, aislesData, productsData, magasinsData] =
        await Promise.all([
          fetchList(),
          fetchAisles(),
          fetchDbProducts(),
          fetchMagasins(),
        ]);

      if (listData && aislesData && magasinsData) {
        // Find the magasin for this list
        const magasin = magasinsData.find(
          (m) => m._id === listData.magasin?._id || m._id === listData.magasin
        );

        // Order products by aisle
        const productsInList = listData.products || [];
        const orderedRayonList = orderProducts(
          productsInList,
          magasin,
          aislesData
        );

        setRayonList(orderedRayonList);
        setProductsToDisplay(productsInList);
      }
    } catch (e) {
      console.error("Error fetching data:", e);
      setError("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  }, [fetchList, fetchAisles, fetchDbProducts, fetchMagasins, orderProducts]);

  // Refetch list and reorder products
  const refetchList = useCallback(async () => {
    const listData = await fetchList();
    if (listData && magasins.length > 0 && aisles.length > 0) {
      const magasin = magasins.find(
        (m) => m._id === listData.magasin?._id || m._id === listData.magasin
      );
      const productsInList = listData.products || [];
      const orderedRayonList = orderProducts(productsInList, magasin, aisles);

      setRayonList(orderedRayonList);
      setProductsToDisplay(productsInList);
    }
  }, [fetchList, magasins, aisles, orderProducts]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    // Data
    list,
    aisles,
    dbProducts,
    magasins,
    productsToDisplay,
    rayonList,
    isLoading,
    error,
    listDeleted,

    // Actions (on ajoutera ça plus tard)
    refetchList,

    // Pour la navigation après suppression
    setListDeleted,
  };
}
