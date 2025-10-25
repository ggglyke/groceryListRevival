import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

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

  // Helper function to prepare list data for backend (strip populated objects)
  const prepareListForBackend = useCallback((listData) => {
    // Only send the fields that should be updated
    return {
      _id: listData._id,
      title: listData.title,
      user: listData.user,
      // Convert products to just IDs (backend expects array of ObjectIds)
      products: listData.products.map((p) =>
        typeof p === "string" ? p : p._id
      ),
      // Convert magasin to just ID
      magasin:
        typeof listData.magasin === "string"
          ? listData.magasin
          : listData.magasin?._id,
      // Convert customProducts rayons to just IDs
      customProducts: (listData.customProducts || []).map((cp) => {
        const customProduct = {
          title: cp.title,
          rayon: typeof cp.rayon === "string" ? cp.rayon : cp.rayon?._id,
        };
        // Only include _id if it's not a temporary ID
        if (cp._id && !cp._id.startsWith("temp-")) {
          customProduct._id = cp._id;
        }
        return customProduct;
      }),
      // Include productCustomNames (Map of productId -> customName)
      productCustomNames: listData.productCustomNames || {},
      checkedProducts: listData.checkedProducts || [],
      hasAisles: listData.hasAisles,
    };
  }, []);

  // Fetch list
  const fetchList = useCallback(async () => {
    if (!listId) return;

    try {
      const response = await ListDataService.get(listId);
      const listData = response.data;

      // Hydrate products with customNames from productCustomNames Map
      if (listData.productCustomNames && listData.products) {
        listData.products = listData.products.map(product => {
          const customName = listData.productCustomNames[product._id];
          return customName ? { ...product, customName } : product;
        });
      }

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
    try {
      const response = await AisleDataService.getAllUserAisles();
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
  }, []);

  // Fetch products from database
  const fetchDbProducts = useCallback(async () => {
    try {
      const response = await ProductDataService.getAllUserProducts();
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
  }, []);

  // Fetch magasins
  const fetchMagasins = useCallback(async () => {
    try {
      const response = await MagasinDataService.findManyByCondition({});
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
  }, []);

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

  // ==================== PRODUCT ACTIONS ====================

  // Toggle product checked state
  const toggleCheck = useCallback(
    async (productId) => {
      if (!list) return;

      try {
        const isCurrentlyChecked = list.checkedProducts.includes(productId);
        let updatedList;

        if (isCurrentlyChecked) {
          // Uncheck: remove from checkedProducts
          updatedList = {
            ...list,
            checkedProducts: list.checkedProducts.filter(
              (id) => id !== productId
            ),
          };
        } else {
          // Check: add to checkedProducts
          updatedList = {
            ...list,
            checkedProducts: [...list.checkedProducts, productId],
          };
        }

        // Optimistic update
        setList(updatedList);

        // Backend update
        await ListDataService.update(
          listId,
          prepareListForBackend(updatedList)
        );
      } catch (e) {
        console.error("Error toggling product:", e);
        toast.error("Erreur lors de la mise à jour du produit", {
          position: "top-right",
        });
        // Revert on error
        await refetchList();
      }
    },
    [list, listId, userId, refetchList, prepareListForBackend]
  );

  // Remove product from list
  const removeProductFromList = useCallback(
    async (productId, isCustomProduct = false) => {
      if (!list) return;

      try {
        let updatedList;

        if (isCustomProduct) {
          // Remove from customProducts array
          updatedList = {
            ...list,
            customProducts: list.customProducts.filter(
              (p) => p._id !== productId
            ),
          };
        } else {
          // Remove from products and checkedProducts arrays
          updatedList = {
            ...list,
            products: list.products.filter((p) => p._id !== productId),
            checkedProducts: list.checkedProducts.filter(
              (id) => id !== productId
            ),
          };
        }

        // Optimistic update
        setList(updatedList);

        // Update productsToDisplay for immediate UI feedback
        if (!isCustomProduct) {
          setProductsToDisplay((prev) =>
            prev.filter((p) => p._id !== productId)
          );
        }

        // Backend update
        await ListDataService.update(listId, prepareListForBackend(updatedList));

        // Refetch to update rayonList
        await refetchList();

        toast.success("Produit retiré de la liste", {
          position: "top-right",
        });
      } catch (e) {
        console.error("Error removing product:", e);
        toast.error("Erreur lors de la suppression du produit", {
          position: "top-right",
        });
        // Revert on error
        await refetchList();
      }
    },
    [list, listId, userId, refetchList, prepareListForBackend]
  );

  // Rename product (add customName)
  const renameProduct = useCallback(
    async (productId, newName, isCustomProduct = false) => {
      if (!list) return;

      try {
        let updatedList;

        if (isCustomProduct) {
          // Update custom product title
          updatedList = {
            ...list,
            customProducts: list.customProducts.map((p) =>
              p._id === productId ? { ...p, title: newName } : p
            ),
          };
        } else {
          // Add customName to regular product
          updatedList = {
            ...list,
            productCustomNames: {
              ...(list.productCustomNames || {}),
              [productId]: newName
            },
            products: list.products.map((p) =>
              p._id === productId ? { ...p, customName: newName } : p
            ),
          };
        }

        // Optimistic update
        setList(updatedList);

        // Backend update
        await ListDataService.update(
          listId,
          prepareListForBackend(updatedList)
        );

        // Refetch to update display
        await refetchList();

        toast.success("Produit renommé", {
          position: "top-right",
        });
      } catch (e) {
        console.error("Error renaming product:", e);
        toast.error("Erreur lors du renommage du produit", {
          position: "top-right",
        });
        // Revert on error
        await refetchList();
      }
    },
    [list, listId, userId, refetchList, prepareListForBackend]
  );

  // Add product to list
  const addProductToList = useCallback(
    async (productId) => {
      if (!list) return;

      try {
        // Check if product already in list
        const alreadyInList = list.products.some((p) => p._id === productId);

        if (alreadyInList) {
          // Check if product is checked
          const isChecked = list.checkedProducts.includes(productId);

          if (isChecked) {
            // Uncheck the product
            const updatedList = {
              ...list,
              checkedProducts: list.checkedProducts.filter(
                (id) => id !== productId
              ),
            };

            // Optimistic update
            setList(updatedList);

            // Backend update
            await ListDataService.update(
              listId,
              prepareListForBackend(updatedList),
              userId
            );

            // Refetch to update display
            await refetchList();

            toast.success("Produit décoché", {
              position: "top-right",
            });
            return;
          } else {
            // Product already in list and not checked
            toast.info("Ce produit est déjà dans la liste", {
              position: "top-right",
            });
            return;
          }
        }

        // Find the product in dbProducts
        const productToAdd = dbProducts.find((p) => p._id === productId);
        if (!productToAdd) {
          toast.error("Produit introuvable", {
            position: "top-right",
          });
          return;
        }

        // Add to products array
        const updatedList = {
          ...list,
          products: [...list.products, productToAdd],
        };

        // Optimistic update
        setList(updatedList);
        setProductsToDisplay([...list.products, productToAdd]);

        // Backend update
        await ListDataService.update(listId, prepareListForBackend(updatedList));

        // Increment times_added counter for this product
        try {
          await ProductDataService.update(
            productId,
            { $inc: { times_added: 1 } }
          );
        } catch (e) {
          console.error("Error incrementing times_added:", e);
          // Don't fail the whole operation if increment fails
        }

        // Refetch to update rayonList with proper ordering
        await refetchList();

        toast.success("Produit ajouté à la liste", {
          position: "top-right",
        });
      } catch (e) {
        console.error("Error adding product:", e);
        toast.error("Erreur lors de l'ajout du produit", {
          position: "top-right",
        });
        // Revert on error
        await refetchList();
      }
    },
    [list, listId, userId, dbProducts, refetchList, prepareListForBackend]
  );

  // Add custom product to list (with option to also add to database)
  const addCustomProductToList = useCallback(
    async (productTitle, rayonId, alsoAddToDatabase = false) => {
      if (!list) return;

      try {
        if (alsoAddToDatabase) {
          // Create product in database first
          const response = await ProductDataService.create({
            title: productTitle,
            rayon: rayonId,
          });

          const createdProduct = response.data.product;

          // Add the database product to the list
          const updatedList = {
            ...list,
            products: [...list.products, { _id: createdProduct._id }],
          };

          // Optimistic update
          setList(updatedList);

          // Backend update
          await ListDataService.update(listId, updatedList, userId);

          // Update product counter
          await ProductDataService.update(createdProduct._id, {
            times_added: 1,
          });

          // Refetch products and list
          await fetchDbProducts();
          await refetchList();

          toast.success("Produit ajouté à la liste et à la base de données", {
            position: "top-right",
          });
        } else {
          // Add as custom product (not in database)
          const tempId = `temp-${Date.now()}`;

          const newCustomProduct = {
            _id: tempId,
            title: productTitle,
            rayon: rayonId,
          };

          // Add to customProducts array (ensure it exists)
          const updatedList = {
            ...list,
            customProducts: [...(list.customProducts || []), newCustomProduct],
          };

          // Optimistic update
          setList(updatedList);

          // Backend update
          await ListDataService.update(
            listId,
            prepareListForBackend(updatedList),
            userId
          );

          // Refetch to update rayonList with proper ordering
          await refetchList();

          toast.success("Produit personnalisé ajouté", {
            position: "top-right",
          });
        }
      } catch (e) {
        console.error("Error adding custom product:", e);
        toast.error("Erreur lors de l'ajout du produit", {
          position: "top-right",
        });
        // Revert on error
        await refetchList();
      }
    },
    [list, listId, userId, refetchList, prepareListForBackend, fetchDbProducts]
  );

  // Delete all checked products
  const deleteAllCheckedProducts = useCallback(async () => {
    if (!list || list.checkedProducts.length === 0) return;

    try {
      const updatedList = {
        ...list,
        products: list.products.filter(
          (p) => !list.checkedProducts.includes(p._id)
        ),
        customProducts: list.customProducts.filter(
          (p) => !list.checkedProducts.includes(p._id)
        ),
        checkedProducts: [],
      };

      // Optimistic update
      setList(updatedList);
      setProductsToDisplay(updatedList.products);

      // Backend update
      await ListDataService.update(listId, updatedList, userId);

      // Refetch to update rayonList
      await refetchList();

      toast.success("Produits cochés supprimés", {
        position: "top-right",
      });
    } catch (e) {
      console.error("Error deleting checked products:", e);
      toast.error("Erreur lors de la suppression des produits cochés", {
        position: "top-right",
      });
      // Revert on error
      await refetchList();
    }
  }, [list, listId, userId, refetchList, prepareListForBackend]);

  // Delete all products (clear list)
  const deleteAllProducts = useCallback(async () => {
    if (!list) return;

    try {
      const updatedList = {
        ...list,
        products: [],
        checkedProducts: [],
        customProducts: [],
      };

      // Optimistic update
      setList(updatedList);
      setProductsToDisplay([]);
      setRayonList([]);

      // Backend update
      await ListDataService.update(
        listId,
        prepareListForBackend(updatedList),
        userId
      );

      toast.success("Liste vidée", {
        position: "top-right",
      });
    } catch (e) {
      console.error("Error clearing list:", e);
      toast.error("Erreur lors du vidage de la liste", {
        position: "top-right",
      });
      // Revert on error
      await refetchList();
    }
  }, [list, listId, userId, refetchList, prepareListForBackend]);

  // ==================== LIST ACTIONS ====================

  // Update list title
  const updateListTitle = useCallback(
    async (newTitle) => {
      if (!list || !newTitle.trim()) return;

      try {
        const updatedList = {
          ...list,
          title: newTitle,
        };

        // Optimistic update
        setList(updatedList);

        // Backend update
        await ListDataService.update(
          listId,
          prepareListForBackend(updatedList)
        );

        toast.success("Titre mis à jour", {
          position: "top-right",
        });

        return { success: true };
      } catch (e) {
        console.error("Error updating title:", e);
        toast.error("Erreur lors de la mise à jour du titre", {
          position: "top-right",
        });
        // Revert on error
        await refetchList();
        return { success: false };
      }
    },
    [list, listId, userId, refetchList, prepareListForBackend]
  );

  // Change list magasin
  const changeMagasin = useCallback(
    async (magasinId) => {
      if (!list) return;

      try {
        const updatedList = {
          ...list,
          magasin: magasinId,
        };

        // Optimistic update
        setList(updatedList);

        // Backend update
        await ListDataService.update(
          listId,
          prepareListForBackend(updatedList)
        );

        // Refetch to update product ordering based on new magasin
        await refetchList();

        toast.success("Magasin changé", {
          position: "top-right",
        });
      } catch (e) {
        console.error("Error changing magasin:", e);
        toast.error("Erreur lors du changement de magasin", {
          position: "top-right",
        });
        // Revert on error
        await refetchList();
      }
    },
    [list, listId, userId, refetchList, prepareListForBackend]
  );

  // Delete list
  const deleteList = useCallback(async () => {
    try {
      await ListDataService.delete(listId);
      setListDeleted(true);
      toast.success("Liste supprimée", {
        position: "top-right",
      });
    } catch (e) {
      console.error("Error deleting list:", e);
      toast.error("Erreur lors de la suppression de la liste", {
        position: "top-right",
      });
    }
  }, [listId, userId]);

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

    // Product Actions
    toggleCheck,
    removeProductFromList,
    renameProduct,
    addProductToList,
    addCustomProductToList,
    deleteAllCheckedProducts,
    deleteAllProducts,

    // List Actions
    updateListTitle,
    changeMagasin,
    deleteList,
    refetchList,

    // Pour la navigation après suppression
    setListDeleted,
  };
}
