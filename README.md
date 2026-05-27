# 🛒 Mini-boutique

> Plateforme e-commerce full-stack avec authentification JWT, panier persistant et paiement Stripe.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-336791?logo=postgresql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Checkout-635BFF?logo=stripe&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS_v4-06B6D4?logo=tailwindcss&logoColor=white)

---

## 📸 Aperçu

### Catalogue avec filtres
![Catalogue](docs/screenshots/01-catalog.png)

### Page produit
![Détail produit](docs/screenshots/02-product-detail.png)

### Panier persistant
![Panier](docs/screenshots/03-cart.png)

### Paiement Stripe (mode test)
![Checkout](docs/screenshots/04-checkout.png)

### Historique des commandes
![Mes commandes](docs/screenshots/05-orders.png)

---

## ✨ Fonctionnalités

- 🛍️ **Catalogue dynamique** — Liste produits avec filtrage par catégorie et recherche
- 🔐 **Authentification JWT** — Inscription, connexion, déconnexion, route protégée `/mon-compte`
- 🛒 **Panier intelligent** — Persistance en `localStorage`, modification des quantités, calcul temps réel
- 💳 **Paiement Stripe Checkout** — Redirection vers la page de paiement officielle Stripe (mode sandbox)
- 🪝 **Webhook Stripe** — Confirmation asynchrone du paiement avec validation de signature et idempotence
- 📦 **Historique de commandes** — Page dédiée avec statuts visuels (En attente / Payée / Expédiée / Annulée)
- 🔒 **Validation côté serveur** — Recalcul des prix en base, jamais de confiance au client

---

## 🛠️ Stack technique

### Frontend
| Tech | Usage |
|---|---|
| **React 18 + Vite** | UI déclarative + dev server ultra-rapide |
| **React Router v6** | Routing SPA |
| **Zustand** | State management (panier + auth) avec middleware `persist` |
| **Tailwind CSS v4** | Styling utility-first |
| **Axios** | Client HTTP avec intercepteur JWT automatique |

### Backend
| Tech | Usage |
|---|---|
| **Node.js + Express 5** | API REST |
| **PostgreSQL + Prisma ORM** | Base de données + migrations versionnées |
| **JWT + bcrypt** | Authentification stateless + hash mots de passe |
| **Zod** | Validation runtime des inputs |
| **Stripe SDK** | Création de sessions Checkout + vérification webhook |

---

## 🏗️ Architecture 
┌─────────────────────────────┐         ┌─────────────────────────────┐
│   Frontend (Vite + React)   │  HTTPS  │    Backend (Express API)    │
│   ─────────────────────     │ ◄─────► │    ────────────────────     │
│   Pages, Components         │   JSON  │    Routes, Middlewares      │
│   Zustand stores            │   JWT   │    Prisma client            │
│   localStorage (cart, auth) │         │                             │
└─────────────────────────────┘         └──────────────┬──────────────┘
│
┌────────────┴────────────┐
│                         │
▼                         ▼
┌──────────────┐         ┌────────────────┐
│ PostgreSQL   │         │ Stripe API     │
│ users        │         │ ─────────────  │
│ products     │         │ Checkout       │
│ orders       │         │ Webhooks       │
│ order_items  │         │                │
└──────────────┘         └────────────────┘
---

## 🔐 Sécurité

### Implémenté
- ✅ **Hash bcrypt 12 rounds** des mots de passe (jamais stockés en clair)
- ✅ **JWT signés** avec expiration 7 jours
- ✅ **Mots de passe renforcés** : 8+ caractères, majuscule, minuscule, chiffre obligatoires (validation Zod côté serveur + indicateur visuel côté client)
- ✅ **Rate limiting** :
  - 5 tentatives login/register / IP / 15 min (anti brute-force)
  - 100 requêtes / IP / 15 min sur toute l'API (anti-DDoS basique)
- ✅ **Helmet** : 12 headers HTTP de sécurité (CSP, X-Frame-Options, anti-clickjacking, etc.)
- ✅ **Mitigation timing attack** sur le login (appel bcrypt même si l'email n'existe pas)
- ✅ **Messages d'erreur génériques** sur l'auth (empêche l'énumération d'emails)
- ✅ **CORS** restreint à l'origine du client uniquement
- ✅ **Webhook Stripe signé** : vérification de la signature `whsec_*`
- ✅ **Idempotence du webhook** : pas de double traitement si Stripe retry
- ✅ **Transactions atomiques** Prisma (commande + stock dans un seul `$transaction`)
- ✅ **Validation Zod** sur tous les inputs sensibles
- ✅ **Recalcul prix côté serveur** au checkout (impossible de manipuler le panier)
- ✅ **Prisma ORM** : protection native contre les injections SQL
- ✅ **Variables d'environnement** non versionnées

### Limites assumées (projet pédagogique)
- ⚠️ **JWT en `localStorage`** : vulnérable au XSS. En prod réelle, on passerait à des **cookies httpOnly + Secure + SameSite=Strict** avec **refresh tokens** pour permettre la révocation de sessions.
- ⚠️ **Pas de vérification email** à l'inscription. En prod : envoi d'un lien magique via Resend/Brevo avant activation du compte.
- ⚠️ **Pas de 2FA** sur les comptes admin. En prod : TOTP (Google Authenticator).
- ⚠️ **Pas de protection CSRF** explicite (acceptable avec JWT en `Authorization` header, deviendrait nécessaire si passage aux cookies).
---

## 🚀 Lancer en local

### Prérequis
- **Node.js** 18+
- **PostgreSQL** 14+
- **Compte Stripe** (gratuit, en mode test) — [s'inscrire](https://dashboard.stripe.com/register)
- **Stripe CLI** pour les webhooks locaux — [installation](https://stripe.com/docs/stripe-cli)

### Setup backend

\`\`\`bash
cd server
npm install

# Copier le template .env et remplir vos valeurs
cp .env.example .env
\`\`\`

Variables à renseigner dans `server/.env` :

\`\`\`
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce_dev
JWT_SECRET=your_jwt_secret_minimum_32_chars
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
\`\`\`

Puis :

\`\`\`bash
# Appliquer les migrations
npx prisma migrate dev

# Insérer des produits de démo
npm run seed

# Lancer le serveur
npm run dev
\`\`\`

Le backend tourne sur `http://localhost:3000`.

### Setup frontend

\`\`\`bash
cd client
npm install

# Créer le .env
echo "VITE_API_URL=http://localhost:3000/api" > .env

npm run dev
\`\`\`

Le frontend tourne sur `http://localhost:5173`.

### Webhook Stripe (paiement)

Dans un terminal séparé :

\`\`\`bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
\`\`\`

Récupérer le `whsec_...` affiché et le coller dans `server/.env`.

---

## 💳 Tester un paiement

1. Inscrire un compte sur `/inscription`
2. Ajouter des produits au panier depuis `/catalogue`
3. Cliquer **"Passer commande"** sur la page panier
4. Sur la page Stripe Checkout, utiliser la carte de test :

| Champ | Valeur |
|---|---|
| Numéro | `4242 4242 4242 4242` |
| Date | n'importe quelle date future (ex. `12/30`) |
| CVC | `123` |
| Email / Nom | au choix |

5. Après paiement, redirection vers `/commande-confirmee`
6. Vérifier dans `/mes-commandes` que le statut est passé à **"Payée"** ✅

---

## 📂 Structure du projet

\`\`\`
projet4_e_commerce/
├── client/                  # Frontend React
│   ├── src/
│   │   ├── api/             # Client axios + intercepteur JWT
│   │   ├── components/      # Header, Layout, ProductCard
│   │   ├── pages/           # Accueil, Catalogue, Panier, etc.
│   │   ├── store/           # Stores Zustand (cart, auth)
│   │   └── App.jsx          # Routing principal
│   └── vite.config.js
│
├── server/                  # Backend Express
│   ├── prisma/
│   │   ├── schema.prisma    # Modèles DB
│   │   ├── migrations/      # Historique des migrations
│   │   └── seed.js          # Données de démo
│   └── src/
│       ├── lib/             # Instance Stripe
│       ├── middleware/      # requireAuth, requireAdmin
│       ├── routes/          # /products, /auth, /checkout, etc.
│       ├── prisma.js        # Instance Prisma singleton
│       └── index.js         # Entry point
│
├── docs/screenshots/        # Captures d'écran
└── README.md
\`\`\`

---

## 📝 Endpoints API

### Publics
- `GET /api/products` — Liste produits (filtres : `?category=audio&search=micro`)
- `GET /api/products/:id` — Détail produit
- `POST /api/auth/register` — Inscription
- `POST /api/auth/login` — Connexion
- `POST /api/webhooks/stripe` — Webhook Stripe

### Authentifiés (JWT requis)
- `GET /api/me` — Profil connecté
- `POST /api/checkout` — Crée une session Stripe Checkout
- `GET /api/orders` — Historique des commandes

---

## 🎓 Ce que j'ai appris

- Construire une **API REST** complète avec validation, auth et gestion d'erreurs
- Modéliser une base de données relationnelle avec **relations** et **transactions atomiques**
- Implémenter une **authentification JWT** sécurisée de bout en bout
- Intégrer un **paiement réel** (mode sandbox) avec gestion des webhooks asynchrones
- Gérer du **state global** côté React avec persistance localStorage
- Sécuriser les flux sensibles : recalcul prix serveur, signature webhook, idempotence

---

## 📜 Licence

Projet personnel à but pédagogique. Libre de réutilisation.

---

**Auteur** : [Marc Danon](https://github.com/Marco-espirito)