# RedSheet API - Backend Core

## 📋 Présentation

**RedSheet API** est le moteur serveur de la plateforme de gestion d'opérations de Red Teaming. Cette API RESTful fournit les services d'authentification, de persistance des données et de journalisation sécurisée pour l'interface client.

Elle a été conçue avec une approche **Security-First**, intégrant des contrôles d'accès stricts (RBAC) et une traçabilité complète des actions (Logging).

## 🛠️ Stack Technologique

- **Environnement** : Node.js (v16+)
- **Framework Web** : Express.js
- **Base de Données** : MongoDB (NoSQL)
- **ODM** : Mongoose
- **Authentification** : JWT (Stateless)
- **Sécurité** : Bcrypt.js, Multer, Helmet concepts

## ⚙️ Installation & Configuration

### 1. Pré-requis
Assurez-vous que les services suivants sont installés sur votre environnement :
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (Service local ou Cluster Atlas)

### 2. Installation des dépendances
```bash
npm install
```

### 3. Configuration des Variables d'Environnement
Créez un fichier `.env` à la racine du projet. Ce fichier contient les secrets de configuration et ne doit jamais être commité (conforme ISO A.8.9 - Gestion des secrets).
(il est commité pour le bg zach, le goat, le king, au cas où tu clones et check le projet)

```env
# Base de Données
MONGO_URI="mongodb://localhost:27017/redsheet"

# Sécurité JWT
JWT_SECRET="FPLGF7JS8jpIzyfrEkZZqubmuemqELQehoYaEhSv8ot"
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

### 4. Démarrage
```bash
npm run dev
```

## 🔐 Contrôles de Sécurité (Conformité ISO A.8)

Ce projet implémente plusieurs contrôles technologiques pour garantir la confidentialité et l'intégrité des données :

### A.8.2 - Gestion des droits d'accès privilégiés
- **RBAC (Role-Based Access Control)** : Système de permissions granulaire (`GUEST`, `PENTESTER`, `ADMIN`).
- **Middleware de Protection** : Vérification systématique du token JWT sur les routes protégées.
- **Segregation of Duties** : Les utilisateurs ne peuvent modifier ou supprimer que leurs propres ressources (sauf Admin).

### A.8.15 - Journalisation (Logging)
- **Audit Logs** : Toutes les actions critiques (création, modification, suppression, login échoué) sont enregistrées dans la collection `logs`.
- **Traçabilité** : Chaque entrée de log contient l'acteur, l'action, le timestamp et le niveau de criticité.
- **Immutabilité** : Les logs ne sont pas modifiables via l'API standard.

### A.8.28 - Sécurité du développement
- **Input Sanitization** : Utilisation de `escapeRegex` pour prévenir les injections NoSQL dans les fonctions de recherche.
- **Mass Assignment Protection** : Utilisation de `filterObj` pour restreindre les champs modifiables par l'utilisateur (ex: empêcher l'élévation de privilèges via le body de la requête).
- **Secure Password Storage** : Hachage irréversible des mots de passe avec `bcrypt` (Cost factor 12).
- **Secure File Upload** : Validation stricte des types MIME et renommage aléatoire des fichiers uploadés via `Multer`.

## 📚 Documentation API (Endpoints Principaux)

| Ressource | Méthodes | Description | Accès |
|-----------|----------|-------------|-------|
| `/api/v1/users` | POST, POST (Login) | Gestion des comptes et authentification | Public / Auth |
| `/api/v1/payloads` | GET, POST, PATCH, DELETE | Base de données des vecteurs d'attaque | Auth |
| `/api/v1/targets` | GET, POST, PATCH, DELETE | Gestion du scope et des cibles | Pentester+ |
| `/api/v1/boxes` | GET, POST, PATCH, DELETE | Suivi des machines compromises | Pentester+ |
| `/api/v1/tools` | GET, POST, PATCH, DELETE | Arsenal d'outils et documentation | Auth (Write: Admin) |
| `/api/v1/logs` | GET, DELETE | Journaux d'audit système | Admin |
| `/api/v1/search` | GET | Recherche globale sécurisée | Auth |

---

**RedSheet** - *Centralized Pentest Operations*
© 2026 - Tous droits réservés.
