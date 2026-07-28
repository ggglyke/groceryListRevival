# Fonctionnalités de GroceryList — référence

Document de référence sur les fonctionnalités de l'application, orienté utilisateur final. Généré par exploration du code le 2026-07-28. À utiliser pour éviter de re-explorer tout le code source à chaque nouveau chantier — mais vérifier la fraîcheur si le code a beaucoup évolué depuis.

## 1. Deux types de listes

À la création (bouton "Créer une liste", proposé en dropdown sur `/lists` et sur l'état vide), l'utilisateur choisit entre deux types, définis dans `EmptyLists.jsx` / `Lists.jsx` :

- **Liste simple** — "Des éléments à cocher, c'est tout. Idéal pour une TODO list." Pas de rayons, pas de magasin : juste un texte libre à ajouter et cocher (avec lien et prix optionnels). Usage : listes non-courses (ex. tâches, liste de cadeaux, réservations diverses — l'exemple placeholder dans le formulaire est "Réserver le restaurant").
- **Liste de courses (rayonnage, magasin)** — "Une liste que vous attribuez à un magasin, avec des rayons dans un ordre que vous définissez. Idéal pour une liste de courses." Les produits y sont organisés par rayon dans l'ordre défini pour le magasin choisi.

Ce choix n'est pas figé : depuis le menu d'une liste ouverte (roue crantée), on peut "Passer en liste simple" / "Passer en liste de courses" à tout moment (`ListHeader.jsx`, action `changeListType`).

Sur la page `/lists`, chaque liste affiche son nombre de produits et sa date de dernière modification (`ListItem.jsx`).

## 2. Rayons et magasins

- **Rayons** (`/aisles`) : une base de rayons personnels (ex. "Fruits et légumes", "Crémerie"...) gérée indépendamment des magasins. Un rayon "par défaut" (`isDefault`, souvent nommé "Divers") existe toujours et sert de filet de sécurité : c'est là que sont rangés les produits ajoutés en "ajout rapide" ou les produits dont le rayon d'origine a été supprimé.
- **Magasins** (`/magasins`) : chaque magasin possède son propre **ordre de rayons** (`rayonsOrder`), réglable par glisser-déposer sur la page d'un magasin (`Magasin.jsx` + `AisleOrderList.jsx`, via drag & drop). Le texte d'aide y est explicite : *"Changez l'ordre des rayons grâce au glisser-déposer. L'ordre des rayons détermine l'ordre d'affichage des produits dans vos listes."*
- **Lien avec les listes** : une liste "de courses" est rattachée à un magasin (sélecteur "Magasin :" dans l'en-tête de liste, avec lien direct "Gérer les magasins"). Les produits de la liste sont alors regroupés visuellement par rayon, dans l'ordre défini pour ce magasin — ce qui permet de suivre son parcours en magasin sans zigzaguer. Changer le magasin d'une liste réordonne immédiatement l'affichage.
- Un rayon supprimé ou absent de l'ordre du magasin ne fait pas disparaître les produits : ils basculent automatiquement dans le rayon par défaut, ou sont ajoutés en fin de liste (rayons non classés) — donc rien n'est jamais perdu de vue.

## 3. Ajout de produits à une liste

Le comportement diffère selon le type de liste :

**Liste de courses (avec rayons)** — barre de recherche avec autocomplete (`ProductSearchBar.jsx` + `SearchBar`/`searchbar.component.js`) :
- Recherche insensible aux accents dans la base de produits personnelle ; jusqu'à 15 résultats affichés, avec le rayon de chaque produit indiqué, et un indicateur (point vert) si le produit est déjà présent dans la liste (et non coché).
- Cliquer un résultat l'ajoute directement à la liste.
- Si le produit tapé n'existe pas encore dans la base, deux options sont proposées :
  - **"Ajouter"** → ouvre une modale pour créer un nouveau produit avec choix du rayon obligatoire, et une case à cocher "Ajouter également à la base de produits" (sinon c'est un produit "custom", temporaire, propre à cette liste uniquement).
  - **"Ajout rapide (divers)"** → ajoute instantanément le produit comme produit personnalisé dans le rayon par défaut, sans passer par la modale.
- Un onglet **"💡 Suggestions"** propose jusqu'à 12 produits de la base non encore présents dans la liste, triés par nombre de fois où ils ont été ajoutés (`times_added`) — un clic les ajoute directement.
- Les produits ajoutés à une liste peuvent recevoir un **lien** (URL, ex. lien vers la fiche produit en ligne) et un **prix** (€), visibles et modifiables via le bouton crayon de chaque produit dans la liste (icône lien + prix affichés sous le nom si renseignés).

**Liste simple** — formulaire simplifié : nom de l'élément, plus lien (optionnel) et prix (optionnel), bouton "Ajouter". Pas de notion de rayon.

Chaque produit d'une liste peut être renommé "localement" (nom personnalisé propre à cette liste, sans changer le nom du produit dans la base) via le bouton crayon, et supprimé de la liste via le bouton croix (sans supprimer le produit de la base).

## 4. Cocher les produits et célébration

- Chaque produit a une zone à cocher (`ProductItem.jsx`) avec une petite animation avant de basculer visuellement le produit vers la section "cochés".
- Dans les listes de courses, l'affichage se fait en onglets : "🛒 Produits dans le panier" (les cochés) et "💡 Suggestions" ; les non-cochés restent groupés par rayon en haut de page.
- Dans les listes simples, les éléments cochés descendent dans une section "Cochés" séparée.
- Quand **tous** les produits/éléments d'une liste sont cochés (transition du dernier élément restant à zéro élément non coché), l'app affiche un message de célébration tiré au hasard parmi une douzaine de phrases humoristiques (ex. "ACHIEVEMENT UNLOCKED : Maître des Caddies 🏆") et déclenche une animation de **confettis** (canvas-confetti) centrée sur ce message, pendant environ 3 secondes. La célébration ne se redéclenche pas au simple rechargement d'une liste déjà terminée ; elle se réinitialise dès qu'un produit est décoché.
- La même animation confetti + une coche verte animée sont réutilisées sur la page de confirmation d'email (`verify-email.component.jsx`).

## 5. Menu de gestion d'une liste (roue crantée, `ListHeader.jsx`)

Dans l'en-tête d'une liste ouverte, un menu déroulant (icône engrenage) propose, selon le contexte :
- **Supprimer les produits cochés** (visible seulement s'il y a des produits cochés) — avec modale de confirmation indiquant le nombre concerné.
- **Vider** — supprime tous les produits de la liste (visible s'il y a au moins un produit) — avec modale de confirmation.
- **Renommer** — passe l'en-tête en mode édition inline du titre (champ + boutons "Mettre à jour" / "Annuler").
- **Passer en liste simple / Passer en liste de courses** — bascule le type de la liste.
- **Supprimer la liste** — action distincte (séparée par une ligne), avec icône d'avertissement et modale de confirmation ; redirige ensuite vers `/lists`.

## 6. Pages de gestion "Produits", "Rayons", "Magasins" (accessibles depuis la navbar)

Ces trois pages permettent de gérer sa base de données personnelle, indépendamment de toute liste précise (les modifications s'y répercutent ensuite dans toutes les listes) :

- **`/products` (Produits)** : formulaire de création (nom + rayon obligatoire) toujours visible en haut ; liste de tous les produits avec barre de recherche par nom ; tri cliquable par nom (A-Z/Z-A), par rayon (A-Z/Z-A), ou par nombre d'ajouts (`times_added`, croissant/décroissant) ; édition et suppression individuelles ; bouton "Supprimer tous les produits" (avec confirmation).
- **`/aisles` (Rayons)** : formulaire de création d'un rayon (nom) ; liste de tous les rayons avec renommage/suppression ; bouton "Supprimer tous les rayons" (avec confirmation). Un rayon par défaut existe toujours et ne peut pas être vidé de la même façon (sert de filet de sécurité, cf. section 2).
- **`/magasins` (Magasins)** : liste des magasins de l'utilisateur, bouton "Ajouter un magasin" (crée un magasin nommé "Nouveau magasin" par défaut et redirige vers sa page de configuration) ; renommage inline et suppression (avec confirmation) depuis la liste. Chaque magasin ouvre sur sa propre page (`/magasin/:id`) où l'on renomme le magasin et où l'on définit l'**ordre des rayons** par glisser-déposer (cf. section 2).

Navbar (`navbar.component.js`) : liens "Listes", "Produits", "Rayons", "Magasins", plus un badge d'état serveur ("Serveur OK" / "Démarrage..." / "Serveur hors ligne") et un menu utilisateur (Mon compte, Admin si applicable, Déconnexion).

## 7. PWA

Un fichier `grocery-list-app/public/manifest.json` est présent (nom "Grocery List", icônes 192/512px, `display: "standalone"`, couleurs de thème), ce qui rend l'app théoriquement **installable** sur mobile/desktop (ajout à l'écran d'accueil, affichage en mode application sans barre de navigateur). Cependant, un fichier `src/serviceWorker.js` existe dans le code mais n'est **pas enregistré** dans `src/index.js` (aucun appel `serviceWorker.register()` trouvé) — donc pas de mise en cache offline active ni de fonctionnement hors-ligne garanti actuellement, seule l'installabilité "basique" via le manifest est en place.

## 8. Authentification (rappel, chantiers précédents)

- Inscription avec vérification d'email obligatoire (token 24h), login bloqué tant que non vérifié, bouton de renvoi d'email.
- Mot de passe oublié / réinitialisation par email (token 1h).
- Page "Mon compte" (`/account`) : changement de mot de passe, suppression de compte (cascade complète).
- Page "Admin" (`/admin`, réservée par email) : liste des comptes avec compteurs, suppression cascade.
