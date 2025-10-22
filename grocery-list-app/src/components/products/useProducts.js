/* React */
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

/* services */
import ProductDataService from "../../services/product.service";
import AisleDataService from "../../services/aisle.service";

export default function useProducts({ userId }) {
  // States
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [aisles, setAisles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [sortBy, setSortBy] = useState("timesAdded_descend");

  const fetchProducts = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await ProductDataService.getAllUserProducts(userId);
      let products = Array.isArray(response.data) ? response.data : [];

      // Add times_added = 0 if missing
      products = products.map((p) => ({
        ...p,
        times_added: p.times_added || 0,
      }));

      setProducts(products);
      setFilteredProducts(products);

      //initial sort by times_added_desc
      sortProducts(products, "timesAdded");
    } catch (e) {
      console.error("retrieveProducts error : ", e);
      setError("Impossible de charger les produits");
      toast.error("Erreur lors du chargement des produits", {
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // fetch aisles
  const fetchAisles = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await AisleDataService.getAllUserAisles(userId);
      const aisles = Array.isArray(response.data) ? response.data : [];
      setAisles(aisles);
    } catch (e) {
      console.error("retrieveAisles error", e);
    }
  }, [userId]);

  // filter products
  const filterProducts = useCallback(
    (searchText) => {
      if (!searchText) {
        setFilteredProducts(products);
        return;
      }
      const filtered = products.filter((p) =>
        p.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredProducts(filtered);
    },
    [products]
  );

  // sort products
  const sortProducts = useCallback(
    (productsToSort, sortKey) => {
      let sorted = [...productsToSort];
      let newSortBy = sortBy;

      if (sortKey === "productName") {
        if (sortBy !== "productName_AZ") {
          sorted.sort((a, b) => a.title.localeCompare(b.title));
          newSortBy = "productName_AZ";
        } else {
          sorted.sort((a, b) => a.title.localeCompare(b.title)).reverse();
          newSortBy = "productName_ZA";
        }
      } else if (sortKey === "aisleName") {
        if (sortBy !== "aisleName_AZ") {
          sorted.sort((a, b) => a.rayon?.title.localeCompare(b.rayon?.title));
          newSortBy = "aisleName_AZ";
        } else {
          sorted
            .sort((a, b) => a.rayon?.title.localeCompare(b.rayon?.title))
            .reverse();
          newSortBy = "aisleName_ZA";
        }
      } else if (sortKey === "timesAdded") {
        if (sortBy !== "timesAdded_descend") {
          sorted.sort((a, b) => a.times_added - b.times_added);
          newSortBy = "timesAdded_descend";
        } else {
          sorted.sort((a, b) => a.times_added - b.times_added).reverse();
          newSortBy = "timesAdded_ascend";
        }
      }

      setSortBy(newSortBy);
      setProducts(sorted);
      setFilteredProducts(sorted);
    },
    [sortBy]
  );

  // Create product
  const createProduct = useCallback(
    async (productData) => {
      if (!userId) {
        toast.error("Vous devez être connecté", { position: "top-right" });
        return;
      }

      try {
        const data = {
          user: userId,
          title: productData.title,
          rayon: productData.aisleId,
          times_added: 0,
        };

        const response = await ProductDataService.create(data);

        if (response.data.created === true) {
          toast.success("Produit créé avec succès !", {
            position: "top-right",
          });
          await fetchProducts();
          return { success: true };
        } else {
          toast.error(response.data.message, { position: "top-right" });
          return { success: false };
        }
      } catch (err) {
        console.error("Erreur lors de la création du produit : ", err);
        toast.error("Impossible de créer le produit.", {
          position: "top-right",
        });
        return { success: false };
      }
    },
    [userId, fetchProducts]
  );

  // update product
  const updateProduct = useCallback(
    async (productId, productData) => {
      try {
        const data = {
          title: productData.title,
          rayon: productData.aisleId,
        };

        await ProductDataService.update(productId, data, userId);
        toast.success("Produit mis à jour", { position: "top-right" });
        setCurrentProduct(null);
        await fetchProducts();
        return { success: true };
      } catch (err) {
        console.error("Erreur lors de la mise à jour du produit", err);
        toast.error("Impossible de mettre à jour le produit", {
          position: "top-right",
        });
        return { success: false };
      }
    },
    [userId, fetchProducts]
  );

  //delete product
  const deleteProduct = useCallback(
    async (productId) => {
      try {
        await ProductDataService.delete(productId, userId);
        toast.success("Produit supprimé", { position: "top-right" });
        await fetchProducts();
        return { success: true };
      } catch (err) {
        console.log("erreur lors de la suppression du produit", err);
        toast.error("Impossible de supprimer le produit", {
          position: "top-right",
        });
        return { success: false };
      }
    },
    [userId, fetchProducts]
  );

  //delete all products
  const deleteAllProducts = useCallback(async () => {
    try {
      await ProductDataService.deleteAll(userId);
      toast.success("Produits supprimés", { position: "top-right" });
      await fetchProducts();
      return { success: true };
    } catch (err) {
      console.log("erreur lors de la suppression des produits", err);
      toast.error("Impossible de supprimer les produits", {
        position: "top-right",
      });
      return { success: false };
    }
  }, [userId, fetchProducts]);

  useEffect(() => {
    fetchProducts();
    fetchAisles();
  }, [fetchProducts, fetchAisles]);

  return {
    products,
    filteredProducts,
    aisles,
    isLoading,
    error,
    currentProduct,
    setCurrentProduct,
    sortBy,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteAllProducts,
    filterProducts,
    sortProducts,
    refetchProducts: fetchProducts,
  };
}
