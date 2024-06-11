# MongoDB

## Introduction

Je vais vous expliquer les différences entre MySQL et MongoDB, ainsi que les concepts clés pour comprendre MongoDB, Atlas et Mongoose. Cela vous aidera à mieux appréhender l'environnement et à faire la transition pour votre projet.

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
- **Mongoose** : Facilitera les interactions entre votre application Node.js et MongoDB.

### Concepts de MongoDB Atlas

1. **Cluster** : Ensemble de serveurs MongoDB qui travaillent ensemble pour stocker vos données et fournir une redondance. Un cluster peut contenir plusieurs bases de données.
2. **Database (Base de données)** : Contient plusieurs collections et stocke vos données. Chaque projet peut avoir une ou plusieurs bases de données.
3. **Collection** : Equivalent d'une table dans MySQL. Une collection stocke plusieurs documents.
4. **Document** : Equivalent d'une ligne dans MySQL, mais plus flexible. Un document est un objet JSON qui peut contenir des champs et des valeurs de différents types.

### Stockage des Données

- **MySQL** :
- **Table** : Ensemble structuré de lignes (enregistrements) et de colonnes (champs).
- **Row (Ligne)** : Un enregistrement dans une table.
- **Column (Colonne)** : Champ dans une table.
- **MongoDB** :
- **Collection** : Ensemble de documents.
- **Document** : Objet JSON contenant les données.
- Les documents dans une collection peuvent avoir des champs différents, ce qui offre plus de flexibilité.

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

## Comparaison entre Mongoose et Sequelize

#### Type de base de données

-   **Mongoose** :
    -   ODM pour MongoDB (base de données NoSQL).
    -   Conçu pour gérer des documents JSON stockés dans des collections.
-   **Sequelize** :
    -   ORM (Object-Relational Mapping) pour les bases de données SQL (telles que MySQL, PostgreSQL, SQLite, et MSSQL).
    -   Conçu pour mapper les objets JavaScript à des tables relationnelles.


### Introduction à Mongoose comme ODM

Mongoose est un ODM (Object Data Modeling) populaire pour MongoDB et Node.js. Il fournit une solution simple pour modeler vos données et inclut des outils intégrés pour la validation, la requête, l'indexation, et plus encore. En utilisant Mongoose, vous pouvez structurer vos données avec des schémas fortement typés et facilement manipuler les données de MongoDB avec des méthodes de haut niveau.

Mongoose rend le travail avec MongoDB plus intuitif en rapprochant le monde non relationnel de MongoDB des concepts plus traditionnels des bases de données relationnelles, tels que les schémas rigides et les relations entre les données. En offrant une abstraction riche, Mongoose permet aux développeurs de se concentrer sur l'amélioration des fonctionnalités de l'application plutôt que sur les détails de la gestion bas niveau de la base de données.

### Parallèle avec les Requêtes SQL

Pour mieux comprendre les opérations CRUD (Create, Read, Update, Delete) réalisées dans le projet avec Mongoose, voyons comment elles se comparent aux requêtes SQL typiques utilisées dans les bases de données relationnelles :

#### 1. Lire des Données (Read) 

- **Mongoose**  :

```javascript
const tasks = await Task.find();
```

Cette commande récupère toutes les tâches de la collection MongoDB. Elle est équivalente à une requête SQL qui sélectionnerait toutes les colonnes de toutes les lignes d'une table. 

- **SQL équivalent**  :

```sql
SELECT * FROM tasks;
```
#### 2. Créer des Données (Create) 

- **Mongoose**  :

```javascript
const newTask = new Task(req.body);
await newTask.save();
```

Ici, un nouvel objet `Task` est créé en utilisant les données reçues dans le corps de la requête (`req.body`) et est ensuite enregistré dans la base de données. C'est similaire à une insertion en SQL. 
- **SQL équivalent**  :

```sql
INSERT INTO tasks (title, completed) VALUES ('new title', false);
```

#### 3. Mettre à jour des Données (Update) 

- **Mongoose**  :

```javascript
const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
```

Cette commande cherche une tâche par son identifiant et met à jour ses propriétés avec les nouvelles valeurs fournies, renvoyant la tâche mise à jour. L'option `{ new: true }` indique que la méthode doit renvoyer l'objet après mise à jour. 

- **SQL équivalent**  :

```sql
UPDATE tasks SET title = 'updated title', completed = true WHERE id = 1;
```
#### 4. Supprimer des Données (Delete) 

- **Mongoose**  :

```javascript
await Task.findByIdAndDelete(req.params.id);
```

Cette méthode trouve une tâche par son ID et la supprime de la base de données, ce qui est similaire à une commande DELETE en SQL. 

- **SQL équivalent**  :

```sql
DELETE FROM tasks WHERE id = 1;
```

🔗 Mongoose documentation : <https://mongoosejs.com/docs/queries.html>