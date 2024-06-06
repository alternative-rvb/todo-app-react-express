# Installer Express JS et React JS

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
