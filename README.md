# Tutorial : Créer une TODO app avec Express JS, React JS et MongoDB Atlas

[[TOC]]

## Installer React JS avec Express JS comme back-end

- Express sur le port 8080
- React sur le port 3000

```bash
npx create-vite todo-app --template react
```

A noter que `npm run build` crée un dossier `dist` qui contient le code compilé et les fichiers statiques sont dans le dossier `public`.

On va maintenant créer un dossier `server/` qui contiendra le code de l'API (back-end ExpressJS) et se placer dans le dossier.

```bash
mkdir server
cd server
touch package.json
```

Créer dans le dossier `server/` le fichier package.json avec ce contenu `{}`

Puis installer les modules suivants

```bash
npm i express
```

Dans `app.js` insérer le code suivant :

```js
const express = require("express");
const app = express();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}\nvia http://localhost:8080`);
});
```

Tester le server avec la commande

```bash
node app.js
```

Installer `nodemon`
npm i nodemon -g
``

Tester le server avec `nodemon`

```bash
nodemon app.js
```

Dans `app.js` ajouter les lignes suiavntes et tester le resultat sur le navigateur:

```js
// Database

const todos = [
  {
    id: 1,
    title: "Buy milk",
    completed: false,
  },
  {
    id: 2,
    title: "Buy eggs",
    completed: false,
  },
  {
    id: 3,
    title: "Buy bread",
    completed: false,
  },
];

app.get("/api/tasks", (req, res) => {
  // Express converts the todos array to JSON and sends it back to the client
  res.send(todos);
});
```

Maintenant on va tenter de fetch les données dans React:

```jsimport { useState, useEffect } from "react";
function App() {

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
      fetch("/api/tasks")
        .then((res) => res.json())
        .then((data) => {
          setTasks(data);
        })

  }, []);

  function renderTasks() {
    return tasks.map((task) => {
      return <li key={task.id}>{task.title}</li>;
    });
  }

  return (
    <main>
      <h1>Hello</h1>
      {renderTasks()}
    </main>
  );
}

export default App;
```

Lancer le server de react `npm run dev`
A ce stade React ecoute le port 3000 et le server sur le port 8080 et cela produira une erreur...

Lancer la commande `npm run build`

On peut deplacer le dossier `dist` ( ou `build`) vers le dossie de server ExpressJS `server/`

Insérer les lignes suivantes pour servir le dossier `dist` sur le serveur ExpressJS `server/`

```js
const express = require("express");
const app = express();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}\nvia http://localhost:8080`);
});

app.use(express.static("dist"));

// Database

const todos = [
  {
    id: 1,
    title: "Buy milk",
    completed: false,
  },
  {
    id: 2,
    title: "Buy eggs",
    completed: false,
  },
  {
    id: 3,
    title: "Buy bread",
    completed: false,
  },
];

app.get("/api/tasks", (req, res) => {
  // Express converts the todos array to JSON and sends it back to the client
  res.send(todos);
});
```

Express servira le dossier `dist` de react et alors la fonction fetch retournera les donnees de l'API car les fichiers s'executeront sur le meme serveur avec le port `8080`

Maintenant ajouter les lignes suivantes dans `server/package.js`

```js
"scripts": {
    "start": "node server.js"
  },
```

Ce sera la commande pour mettre le site en production

Maintenant pour la version de développement, on va ajouter le code suivant dans `vite.config.js` de react :

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Chemin où les fichiers de production seront générés
    outDir: resolve(__dirname, "./server/dist"),
  },
  server: {
    proxy: {
      // toutes les requêtes commençant par '/api' seront transférées à 'http://localhost:8080'
      "/api": "http://localhost:8080",
    },
  },
});
```

Cela redirigera les requêtes `/api` de react vers le serveur expressJS `server` avec le port `8080`

## Enregistrement des tâches dans la base de données MongoDB

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

## Créons l'application

Commencer par installer Mongoose et dotenv sur le serveur.

```bash
npm i mongoose
npm i dotenv
```

### Créer la base de données MongoDB Atlaas

_A venir_

🎦 Voir: <https://youtu.be/mDgKjb5eWPk?si=5iEaYhuzUuwOBAZk>

### Ajouter le code de l'API dans le fichier `server/app.js`

```javascript
// server/app.js

const express = require("express"); // Importation du module Express
const mongoose = require("mongoose"); // Importation du module Mongoose pour interagir avec MongoDB
const dotenv = require("dotenv"); // Importation du module dotenv pour gérer les variables d'environnement
const path = require("path"); // Importation du module path pour gérer les chemins de fichiers

const app = express(); // Création de l'application Express

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

// Utiliser le middleware pour analyser les requêtes JSON
app.use(express.json());

const PORT = process.env.PORT || 8080; // Définir le port sur lequel le serveur écoute, par défaut 8080

// Connecter à MongoDB Atlas en utilisant la chaîne de connexion depuis le fichier .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Définir le schéma de tâche pour MongoDB
const taskSchema = new mongoose.Schema({
  title: String, // Titre de la tâche
  completed: Boolean // Statut de la tâche (complétée ou non)
});

// Créer le modèle Task basé sur le schéma de tâche
const Task = mongoose.model("Task", taskSchema);

// Logger

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`); // Log la méthode et l'URL
  console.log(req.body); // Log le corps de la requête
  
  const oldSend = res.send;
  res.send = function (data) {
    console.log(`Response status: ${res.statusCode}`); // Log le statut de la réponse
    console.log(data); // Log les données de la réponse
    oldSend.call(this, data);
  }
  next();
});

// Routes CRUD

// Route pour obtenir toutes les tâches
app.get("/api/tasks", async (req, res) => {
  try {
    // Trouver toutes les tâches dans la collection tasks
    const tasks = await Task.find();
    // Envoyer les tâches trouvées en réponse
    res.json(tasks);
  } catch (error) {
    // En cas d'erreur, envoyer un statut 500 avec le message d'erreur
    res.status(500).send(error.message);
  }
});

// Route pour créer une nouvelle tâche
app.post("/api/tasks", async (req, res) => {
  try {
    // Créer une nouvelle instance de Task avec les données du corps de la requête
    const newTask = new Task(req.body);
    // Sauvegarder la nouvelle tâche dans la base de données
    await newTask.save();
    // Envoyer la tâche créée avec un statut 201 (Created)
    res.status(201).json(newTask);
  } catch (error) {
    // En cas d'erreur, envoyer un statut 400 avec le message d'erreur
    res.status(400).send(error.message);
  }
});

// Route pour mettre à jour une tâche
app.put("/api/tasks/:id", async (req, res) => {
  try {
    // Trouver la tâche par ID et mettre à jour avec les nouvelles données
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    // Envoyer la tâche mise à jour en réponse
    res.json(updatedTask);
  } catch (error) {
    // En cas d'erreur, envoyer un statut 400 avec le message d'erreur
    res.status(400).send(error.message);
  }
});

// Route pour supprimer une tâche
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    // Trouver la tâche par ID et la supprimer de la base de données
    await Task.findByIdAndDelete(req.params.id);
    // Envoyer un statut 204 (No Content) pour indiquer que la suppression a réussi
    res.status(204).send();
  } catch (error) {
    // En cas d'erreur, envoyer un statut 400 avec le message d'erreur
    res.status(400).send(error.message);
  }
});

// Démarrer le serveur et écouter sur le port spécifié
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}\nvia http://localhost:${PORT}`);
});

// Servir les fichiers statiques de l'application React build
app.use(express.static("dist"));

// Rediriger toutes les autres requêtes vers index.html pour gérer le routage côté client avec React Router
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});
```

### Ajouter le code dans react


```js	
// src/App.jsx
import { useState, useEffect } from "react";
import "./app.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      });
  }, []);

  function handleAddTask() {
    if (!newTask) {
      alert("Please enter a task");
      return;
    }
    fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTask, completed: false }),
    })
      .then((res) => res.json())
      .then((task) => {
        setTasks([...tasks, task]);
        setNewTask("");
      });
  }

  function handleToggleTask(id) {
    const task = tasks.find((task) => task._id === id);
    fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...task, completed: !task.completed }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
      });
  }

  function handleDeleteTask(id) {
    fetch(`/api/tasks/${id}`, { method: "DELETE" }).then(() => {
      setTasks(tasks.filter((task) => task._id !== id));
    });
  }

  function renderTasks() {
    return tasks.map((task) => (
      <li key={task._id} className="flex items-center gap-8">
        <span
          style={{ textDecoration: task.completed ? "line-through" : "none" }}
          onClick={() => handleToggleTask(task._id)}
          className="cursor-pointer flex-1"
        >
          {task.title}
        </span>
        <button
          onClick={() => handleDeleteTask(task._id)}
          className="cursor-pointer"
        >
          Delete
        </button>
      </li>
    ));
  }

  return (
    <main className="mw-420 m-auto p-16 flex flex-col gap-16">
      <div className="p-16 shadow rounded-16">
        <h1>Todo List</h1>
        <div className="flex items-center">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task"
            className="flex-1 p-8"
          />
          <button onClick={handleAddTask} className="p-8 cursor-pointer">
            Add Task
          </button>
        </div>
      </div>
      {tasks.length > 0 ? (
        <ul className="flex flex-col gap-8 p-16">{renderTasks()}</ul>
      ) : (
        <p className="p-16">No tasks yet</p>
      )}
    </main>
  );
}

export default App;
```

❗ Vérifier `package.json` et `server/package.json` pour voir si les modules sont installeés.

```json
{
  "scripts": {
    "start": "node app",
    "dev": "nodemon app"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "mongoose": "^8.4.1"
  }
}
```

On utilisera la commande `npm start` pour lancer le serveur en production et la commande `npm dev` pour lancer le serveur en développement.
