# Roadmap

## 1. Vérification d'email des nouveaux inscrits ✅ Traité

**Fait** (commit `af72955`) : flux complet de vérification. Modèle `User` étoffé (`isVerified`, `emailVerificationToken`, `emailVerificationExpires`), token haché SHA-256 envoyé à l'inscription (expiration 24h), login bloqué (403 + flag `unverified`) tant que le compte n'est pas vérifié, routes `GET /api/users/verify-email` et `POST /api/users/resend-verification` (rate limité, anti-énumération). Frontend : page `/verify-email`, `register.component.jsx` reste sur place avec message d'attente, `login.component.jsx` propose un bouton "Renvoyer l'email" si le compte est non vérifié.

Migration one-shot appliquée en prod : les 3 comptes existants ont été marqués `isVerified: true` (pas de vérification rétroactive).

Bonus : les liens envoyés par email (vérification + reset password) pointent désormais vers l'origine réelle de la requête (`backend/utils/frontendUrl.js`, basé sur le header `Origin` validé contre l'allowlist CORS) — fonctionne aussi bien depuis `localhost:3000` que depuis la prod, avec fallback sur `FRONTEND_URL` si l'origine est absente/inconnue.

## 2. Récupération de mot de passe oublié ✅ Traité

**Fait** (commit `d3ec77b`) : flux complet forgot/reset password. Modèle `User` étoffé (`resetPasswordToken`, `resetPasswordExpires`), token aléatoire haché SHA-256 en DB avec expiration 1h, service d'envoi d'email (`backend/services/email.service.js`, Nodemailer + SMTP), routes `POST /api/users/forgot-password` et `POST /api/users/reset-password` (rate limiting + validation Joi), pages frontend `/forgot-password` et `/reset-password`, lien depuis l'écran de login. Bonus : bouton "œil" pour afficher/masquer le mot de passe sur les champs concernés (login, register, reset).

Variables SMTP configurées sur le VPS, envoi d'email fonctionnel en production.

## 3. Commande vocale pour ajouter des éléments aux listes (long terme)

**Idée** : permettre d'ajouter un produit à une liste via commande vocale (utile mains libres pendant les courses ou en cuisine).

**Pistes à explorer le moment venu :**
- API Web Speech (`SpeechRecognition`) côté navigateur — gratuit, mais support variable selon navigateurs (notamment Safari/iOS, à vérifier vu que l'app est une PWA).
- Alternative : service tiers de speech-to-text (Whisper API, Google Speech-to-Text) si la reconnaissance native est insuffisante.
- Parsing du texte reconnu pour en extraire le(s) nom(s) de produit(s) — possible ambiguïté avec les noms de produits en base (`backend/models/product.model.js`), rayons, quantités éventuelles.
- UX : bouton micro sur l'écran de liste, retour visuel pendant l'écoute, confirmation avant ajout (éviter les ajouts erronés).
- Pas de dépendance avec les points 1 et 2 — indépendant, à traiter séparément.

## 4. Plus de rayons et produits par défaut pour les nouveaux inscrits

**Contexte actuel** : à l'inscription (`register.component.jsx`), seul un jeu de **14 rayons** statiques (`grocery-list-app/src/data/rayons.data.js`) est créé pour le nouvel utilisateur, plus 1 magasin par défaut ("Mon magasin par défaut"). **Aucun produit par défaut** n'est créé — la base produits du nouvel utilisateur démarre vide. Rayons et produits sont des entités **isolées par utilisateur** (`backend/models/rayon.model.js` et `backend/models/product.model.js` ont chacun un champ `user`), il n'existe aujourd'hui aucun mécanisme de duplication de données entre comptes.

Autre lacune actuelle : le magasin créé à l'inscription n'a pas son `rayonsOrder` rempli avec les rayons fraîchement créés — les rayons par défaut n'apparaissent donc pas groupés dans le magasin tant que l'utilisateur ne configure pas manuellement l'ordre des rayons.

**Objectif** : partir des rayons et produits déjà existants sur le profil de Guillaume (compte de référence), les figer dans des fichiers de données statiques du repo, et les utiliser comme nouveau jeu de données par défaut à l'inscription — plus complet que les 14 rayons actuels, et avec des produits pré-remplis (actuellement 0).

**Ce que ça implique :**
- **Extraction ponctuelle** : requêter une fois la base de prod pour le compte de référence (`rayon.controller.js` / `product.controller.js`, filtrés par `user`), récupérer titres de rayons + titres/rayons des produits.
- Étoffer `grocery-list-app/src/data/rayons.data.js` avec le jeu de rayons complet extrait (actuellement 14 entrées `{ title, id, isDefault }`).
- Créer un nouveau fichier `grocery-list-app/src/data/products.data.js` sur le même principe (actuellement inexistant), avec les produits extraits `{ title, rayonTitle }` (le lien produit→rayon devra être résolu par titre de rayon au moment de l'insertion, puisque les IDs de rayons sont générés à la création pour chaque nouvel utilisateur).
- `register.component.jsx` : après la création des rayons (`handleDefaultMagasinData`, actuellement L83-105), ajouter une étape de création des produits par défaut en resolvant chaque `rayonTitle` vers l'`_id` du rayon nouvellement créé pour cet utilisateur, puis `POST` en masse (nécessite une route backend `insertMany` pour les produits, qui n'existe pas encore — seule `rayon.routes.js` a `POST /many` aujourd'hui, cf. `product.routes.js` à étendre).
- **Fix du lien magasin-rayons** : dans `createDefaultMagasin`/`handleDefaultMagasinData`, une fois les rayons créés, mettre à jour le magasin par défaut avec `rayonsOrder` = liste des `_id` des rayons créés (dans l'ordre souhaité), pour que le groupement par rayon fonctionne dès l'inscription (cf. `useList.js:143-145` — sans `magasin.rayonsOrder` rempli, `orderProducts` ne peut pas grouper, cf. le fix récent du crash `e.products undefined`).
- Migration : cette évolution ne concerne que les **nouveaux** comptes ; ne touche pas aux comptes déjà inscrits (pas de rétroactivité nécessaire).

## 5. Automatiser le déploiement du backend sur le VPS ✅ Traité

**Fait** (commit `119799f` + `d612375`) : workflow GitHub Actions `.github/workflows/deploy-backend.yml`, déclenché au push sur `master` touchant `backend/**` (ou manuellement via `workflow_dispatch`). Se connecte en SSH avec une clé dédiée (secrets `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`), fait `git pull` → `npm install --omit=dev` → `pm2 restart groceryList-backend` (process pm2 confirmé sur le VPS, cwd `/var/www/groceryListRevival/backend`), puis vérifie `/healthz`. Testé avec succès via déclenchement manuel.

**Scope volontairement limité au backend** — le frontend (hébergement Apache mutualisé séparé, `guillaumejarry.com/groceryListRevival/`) reste en déploiement manuel.

**Reste à faire si besoin** : documenter le process dans un `DEPLOY.md` (non fait, jugé optionnel vu que le workflow est auto-descriptif).

## 6. Messages d'erreur précis et règles de mot de passe visibles ✅ Traité

**Fait** (commit `f64f2e6`) : le middleware de validation Joi (`validate.middleware.js`) et les contrôleurs (`user.controller.js`) renvoyaient deux formats d'erreur différents — un tableau `[{ field, message }]` côté Joi, un objet `{ password: "..." }` côté contrôleur — que le frontend ne savait déstructurer que dans un seul cas. Résultat : un mot de passe trop court (validation Joi, `min(8)`) affichait le message générique "Une erreur est survenue, réessayez" au lieu du vrai message, et sur la page d'inscription aucun toast ne s'affichait du tout.

- Nouveau helper `grocery-list-app/src/utils/extractPasswordError.js` : gère les deux formats de réponse d'erreur.
- `register.component.jsx` et `reset-password.component.jsx` : utilisent ce helper pour afficher le bon message.
- Nouveau composant `grocery-list-app/src/components/reusable/PasswordRules.jsx` : checklist en temps réel des règles de mot de passe (8 caractères, majuscule, minuscule, chiffre, caractère spécial), état neutre tant que le champ est vide, rouge/vert dynamique ensuite. Affiché sur les pages register et reset-password (sous le champ mot de passe, avant le bouton de validation).
- `backend/utils/passwordValidator.js` : la règle de caractère spécial est passée d'une liste blanche de symboles (qui excluait des caractères valides comme `§` ou `£`) à `[^a-zA-Z0-9]` (tout caractère non alphanumérique accepté), plus simple et exhaustif.

## 7. Page "Mon compte" ✅ Traité

**Fait** : nouvelle page `/account` (`account.component.jsx`), protégée dans le groupe `PrivateRoute`. Changement de mot de passe (`POST /api/users/change-password`, ancien + nouveau, réutilise `validatePassword`/`PasswordRules`/`PasswordInput`). Suppression de compte (`DELETE /api/users/me`) avec confirmation via `AlertModal` — cascade complète (listes, magasins, produits, rayons), invalide le cookie JWT et le cache local à la suppression. Lien "Mon compte" du menu déroulant maintenant fonctionnel.

**Suggestions de fonctionnalités additionnelles pour cette page** (non faites, à trancher selon besoin) :
- Modifier le nom d'utilisateur (`username`) — actuellement non modifiable après inscription.
- Modifier l'adresse email — implique de repasser par une vérification (réutilise le flux du point 1) avant de valider le changement, pour éviter qu'un compte se retrouve avec un email non vérifié.
- Voir la date de création du compte (`createdAt`, déjà stocké via `timestamps: true` sur le modèle `User`, juste à afficher).
- Exporter ses données (listes, produits) en JSON — utile avant une suppression de compte, ou simple demande de portabilité.
- Résumé d'activité (nombre de listes, produits ajoutés) — cosmétique, faible priorité.

**Note d'architecture (vérifiée, pas un bug)** : un rayon appartient à un `user` (`Rayon.user`), pas à un magasin — `Magasin.rayonsOrder` référence juste des IDs de rayons pour exprimer leur ordre d'affichage dans ce magasin précis, sans les posséder. C'est le bon modèle (les rayons sont un concept générique par utilisateur, réutilisé entre plusieurs magasins ; seul l'ordre change d'un magasin à l'autre). Donc supprimer un magasin (`magasin.controller.js:128-153`) ne supprime pas les rayons, et **ce n'est pas un bug de cascade manquant** — c'est le comportement voulu. Vérifié suite à la découverte d'orphelins en base début 2024 (probablement dus à une inscription échouée avant le fix du point 1, pas à ce mécanisme).

## 8. Page "Admin" (compte de Guillaume uniquement) ✅ Traité

**Fait** : `ADMIN_EMAIL` en variable d'env, middleware `requireAdmin` (`auth.middleware.js`, après `requireAuth`), routes `GET /api/admin/users` (liste enrichie de compteurs listes/magasins/produits/rayons par compte) et `DELETE /api/admin/users/:id` (cascade complète, bloque l'auto-suppression via cette route — passe par `/users/me`). Frontend : page `/admin` (`admin.component.jsx`, table + suppression avec `AlertModal` détaillant les données qui seront supprimées), protégée par un nouveau `AdminRoute` (redirige si non-admin), item "Admin" visible conditionnellement dans le menu. Le flag `isAdmin` est calculé côté backend et exposé via `/verify` (pas d'email exposé au frontend).

Bug latent corrigé au passage : `backend/models/user.model.js` exportait directement le modèle compilé au lieu d'une factory `(mongoose) => {...}` comme les autres modèles — `db.users` était silencieusement cassé (jamais utilisé auparavant, les contrôleurs important `user.model.js` en direct). Corrigé pour permettre la cascade admin.

Testé de bout en bout (backend) : changement de mot de passe (bon/mauvais ancien mdp), suppression de compte avec vérification cascade en DB (0 orphelin), 403 pour non-admin et pour auto-suppression via la route admin.
