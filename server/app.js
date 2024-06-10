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


