#  NexusGo Montez et go
**Cours :** HAI726I Technologies Web  
**Auteur :** Nassera Nabgaoui  

NexusGo est une application web de covoiturage réalisée en **Full JavaScript** (Node.js/Express + MongoDB).

## 🛠️ Installation

### 1. Préparation du Backend
Ouvrez votre terminal dans le dossier `backend` et installez les dépendances :

```bash
cd backend
npm install
````

### 2\. Base de Données

Créez un fichier `.env` dans le dossier `backend` et collez-y ceci :

```env
PORT=3000
MONGO_URI=votre_lien_mongodb
JWT_SECRET=votre_cle_secrete
```

### 3\. Initialisation (Important)

Pour créer les utilisateurs de test (car pas d'inscription publique), lancez :

```bash
npm run seed
```



##  Lancement

### 1\. Démarrer le Serveur

Toujours dans le dossier `backend`, lancez :

```bash
npm start
```

Le serveur sera accessible sur : `http://localhost:3000`

### 2\. Ouvrir le Site

Allez dans le dossier `frontend` et ouvrez le fichier `index.html` (double-clic ou Live Server).

## Fonctionnalités

  * **Connexion** : Sécurisée via JWT et Bcrypt.
  * **Recherche** : Par ville de départ/arrivée et date.
  * **Réservation** : Gestion des places en temps réel.
  * **Dates** : Format `AAMMJJ` pour le tri.

## Structure Technique

  * **Backend** : Node.js, Express.
  * **Base de Données** : MongoDB, Mongoose.
  * **Frontend** : HTML5, CSS3, Vanilla JS.

## Structure du Projet

Voici comment est organisé le code source de l'application :

```text
nexusgo/
│
├── backend/                  # Partie Serveur (API Node.js/Express)
│   ├── controller/           # Logique métier
│   │   └── auth.controller.js  # Gestion de l'inscription
│   ├── models/               # Modèles de données (Mongoose schemas)
│   │   ├── Booking.js          # Structure d'une réservation
│   │   ├── Ride.js             # Structure d'un trajet
│   │   └── User.js             # Structure d'un utilisateur
│   ├── routes/               # Définition des endpoints de l'API
│   │   ├── auth.routes.js      # Routes d'authentification
│   │   ├── bookings.js         # Routes des réservations
│   │   ├── rides.js            # Routes des trajets
│   │   ├── users.js            # Routes utilisateurs
│   │   └── connex.js           # Logique de connexion (Login)
│   ├── .env                  # Variables d'environnement (non partagé sur git)
│   ├── database.js           # Configuration de la connexion MongoDB
│   ├── seedUsers.js          # Script d'initialisation des données de test
│   └── server.js             # Point d'entrée principal du serveur
│
├── frontend/                 # Partie Client (Interface Utilisateur)
│   ├── img/                  # Dossier des logos et images
│   ├── index.html            # Page unique de l'application (Single Page)
│   ├── script.js             # Logique client (Appels Fetch, DOM)
│   └── style.css             # Feuilles de style (Responsive design)
│
└── README.md                 # Documentation du projet

