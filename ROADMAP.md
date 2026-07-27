# Roadmap

## 1. Vérification d'email des nouveaux inscrits

**Contexte actuel** : l'inscription (`POST /api/users/register`) crée le compte immédiatement actif, sans aucune vérification d'adresse email. Aucun champ de vérification n'existe sur le modèle `User`, aucun service d'envoi d'email n'est installé.

**Ce que ça implique :**
- Modèle `User` (`backend/models/user.model.js`) : ajouter `isVerified` (Boolean, default false), `verificationToken`, `verificationTokenExpires`.
- Choisir et intégrer un service d'envoi d'email (Resend, SendGrid, ou Nodemailer + SMTP existant) — aucun n'est installé actuellement.
- `register` (`backend/controllers/user.controller.js`) : générer un token de vérification, créer le compte avec `isVerified: false`, envoyer l'email avec lien de confirmation.
- Nouvelle route `GET /api/users/verify-email?token=...` : valide le token, passe `isVerified: true`.
- Bloquer le login tant que `isVerified` est `false`, avec message explicite + route `POST /api/users/resend-verification`.
- Frontend : page `/verify-email`, écran post-inscription "vérifiez votre boîte mail", gestion de l'erreur "compte non vérifié" au login.
- Migration one-shot : marquer `isVerified: true` pour tous les comptes existants avant la mise en place (ne pas bloquer rétroactivement les utilisateurs actuels).

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
