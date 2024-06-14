# MongoDB

## Introduction

Je vais vous expliquer les différences entre MySQL et MongoDB, ainsi que les concepts clés pour comprendre MongoDB et Atlas. Cela vous aidera à mieux appréhender l'environnement et à faire la transition pour votre projet.

### Différences entre MySQL et MongoDB

1. **Type de base de données** :
   - **MySQL** : Base de données relationnelle (RDBMS), utilisant des tables, des lignes et des colonnes. Les données sont structurées et les relations entre les tables sont définies par des clés étrangères.
   - **MongoDB** : Base de données NoSQL, utilisant des documents au format BSON (Binary JSON). Les données sont semi-structurées et peuvent varier d'un document à l'autre dans la même collection.
2. **Schéma** :
   - **MySQL** : Schéma strict, chaque table doit avoir une structure définie avec des colonnes spécifiques.
   - **MongoDB** : Schéma flexible, chaque document dans une collection peut avoir un schéma différent.
3. **Requêtes** :
   - **MySQL** : Utilise le langage SQL pour les requêtes.
   - **MongoDB** : Utilise des requêtes de style JSON.
4. **Scalabilité** :
   - **MySQL** : Scalabilité verticale, ajout de ressources (CPU, RAM) à un seul serveur.
   - **MongoDB** : Scalabilité horizontale, ajout de plusieurs serveurs pour répartir la charge (sharding).

### Concepts Clés : MongoDB, Atlas et Mongoose

1. **MongoDB** : Base de données NoSQL orientée documents. Les documents sont des objets JSON stockés dans des collections. MongoDB est conçu pour être flexible, évolutif et performant.
2. **MongoDB Atlas** : Service de base de données dans le cloud géré par MongoDB. Atlas facilite la gestion des bases de données MongoDB en offrant des fonctionnalités comme l'automatisation, la sécurité, les sauvegardes et la surveillance.
3. **Mongoose** : Bibliothèque ODM (Object Data Modeling) pour Node.js et MongoDB. Mongoose fournit une structure pour vos données, des modèles et des fonctionnalités de validation.

### Utilisation pour votre projet

- **MongoDB** : Stockera vos données.
- **MongoDB Atlas** : Hébergera votre base de données MongoDB dans le cloud.

### Concepts de MongoDB Atlas

1. **Cluster** : Ensemble de serveurs MongoDB qui travaillent ensemble pour stocker vos données et fournir une redondance. Un cluster peut contenir plusieurs bases de données.
2. **Database (Base de données)** : Contient plusieurs collections et stocke vos données. Chaque projet peut avoir une ou plusieurs bases de données.
3. **Collection** : Equivalent d'une table dans MySQL. Une collection stocke plusieurs documents.
4. **Document** : Equivalent d'une ligne dans MySQL, mais plus flexible. Un document est un objet JSON qui peut contenir des champs et des valeurs de différents types.

### Stockage des Données

- **MySQL** : - **Table** : Ensemble structuré de lignes (enregistrements) et de colonnes (champs). - **Row (Ligne)** : Un enregistrement dans une table. - **Column (Colonne)** : Champ dans une table.
- **MongoDB** : - **Collection** : Ensemble de documents. - **Document** : Objet JSON contenant les données. - Les documents dans une collection peuvent avoir des champs différents, ce qui offre plus de flexibilité.

### Exemple de Conversion

#### MySQL Table `users`

| id  | username | password | email            |
| --- | -------- | -------- | ---------------- |
| 1   | john     | 123456   | john@example.com |

#### MongoDB Document in Collection `users`

```json
{
  "_id": ObjectId("60d5f99a1c9d440000a2e1c3"),
  "username": "john",
  "password": "123456",
  "email": "john@example.com"
}
```

En résumé, vous utiliserez MongoDB pour stocker vos données, MongoDB Atlas pour héberger votre base de données dans le cloud, et Mongoose pour faciliter les interactions avec MongoDB depuis votre application Node.js. Les clusters dans Atlas permettent de gérer la redondance et la scalabilité, les bases de données contiennent les collections, et les collections contiennent les documents, offrant une grande flexibilité par rapport aux tables relationnelles de MySQL.

## Tester MongoDB avec Mongosh

### Installation de mongosh pour Windows

1. **Télécharger mongosh** :

- Accédez à la [page de téléchargement de MongoDB Shell (mongosh)](https://www.mongodb.com/try/download/shell) .
- Sélectionnez la version pour Windows et téléchargez l'installateur.

2. **Installation** :

- Exécutez le fichier téléchargé et suivez les instructions d'installation.

### Connexion à une base de données MongoDB Atlas

Pour vous connecter à une base de données MongoDB Atlas, suivez ces étapes :

1. **Obtenez l'URI de connexion** :

- Connectez-vous à votre compte MongoDB Atlas.
- Sélectionnez le cluster auquel vous voulez vous connecter.
- Cliquez sur "Connect", puis sur "Connect using MongoDB Shell".
- Copiez l'URI de connexion. Il ressemblera à ceci :

```php
mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
```

2. **Se connecter via mongosh** :

- Ouvrez une ligne de commande (cmd ou PowerShell).
- Exécutez la commande suivante en remplaçant `<username>`, `<password>`, et `<dbname>` par vos informations :

```shell
mongosh "mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority"
```

### Commandes MongoDB utiles

#### 1. Insertion de documents

```javascript
// Insertion d'un seul document
db.users.insertOne({
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  password: "password123",
  role: "user",
});

// Insertion de plusieurs documents
db.users.insertMany([
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    password: "password456",
    role: "admin",
  },
  {
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@example.com",
    password: "password789",
    role: "user",
  },
]);
```

#### 2. Lecture de documents

```javascript
// Lecture de tous les documents
db.users.find().pretty();

// Lecture d'un seul document
db.users.findOne({ email: "john.doe@example.com" });

// Lecture avec une condition
db.users.find({ role: "user" }).pretty();
```

#### 3. Mise à jour de documents

```javascript
// Mise à jour d'un seul document
db.users.updateOne(
  { email: "john.doe@example.com" },
  { $set: { password: "newpassword123" } }
);

// Mise à jour de plusieurs documents
db.users.updateMany({ role: "user" }, { $set: { role: "member" } });
```

#### 4. Suppression de documents

```javascript
// Suppression d'un seul document
db.users.deleteOne({ email: "john.doe@example.com" });

// Suppression de plusieurs documents
db.users.deleteMany({ role: "member" });
```

#### 5. Indexation

```javascript
// Création d'un index sur le champ email
db.users.createIndex({ email: 1 });

// Création d'un index unique sur le champ email
db.users.createIndex({ email: 1 }, { unique: true });
```

#### 6. Agrégation

```javascript
// Agrégation pour compter le nombre d'utilisateurs par rôle
db.users.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]);

// Agrégation pour filtrer et projeter des champs spécifiques
db.users.aggregate([
  { $match: { role: "admin" } },
  { $project: { firstName: 1, lastName: 1, _id: 0 } },
]);
```

Ces commandes vous permettront de réaliser les opérations de base sur votre collection `users`. Assurez-vous de toujours tester ces commandes dans un environnement de développement avant de les exécuter en production.
