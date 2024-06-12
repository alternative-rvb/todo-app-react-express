const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");
const path = require("path");

const app = express();
dotenv.config();

// Middleware pour analyser les corps JSON des requêtes
app.use(express.json());

const PORT = process.env.PORT || 8080;
let db, tasksCollection;

// Connexion à MongoDB Atlas en utilisant le client natif MongoDB
MongoClient.connect(process.env.MONGO_URI)
  .then((client) => {
    console.log("Connecté à MongoDB Atlas");
    db = client.db(); // Obtenir l'objet de la base de données
    tasksCollection = db.collection("tasks"); // Accéder ou créer la collection des tâches
  })
  .catch((error) => console.error("Erreur de connexion à MongoDB:", error));

// Logger middleware pour logger chaque requête
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("↖️  req.body: ")
  console.log(req.body);
  const oldSend = res.send;
  res.send = function (data) {
    console.log( '↘️ ', `Status: ${res.statusCode}`);
    if (data) console.log(JSON.parse(data));
    oldSend.call(this, data);
  }
  next();
});

// Opérations CRUD

// GET : Récupérer toutes les tâches
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await tasksCollection.find().toArray(); // Récupérer tous les documents
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Échec de la récupération des tâches." });
  }
});

// POST : Créer une nouvelle tâche
app.post("/api/tasks", async (req, res) => {
  try {
    const newTask = req.body;
    const result = await tasksCollection.insertOne(newTask); // Insérer un nouveau document
    res.status(201).json({ ...newTask, _id: result.insertedId }); // Répondre avec la tâche créée
  } catch (error) {
    res.status(400).json({ message: "Échec de la création de la tâche." });
  }
});

// PUT : Mettre à jour une tâche par ID
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Format d'ID invalide" }); // Valider l'ID
    }

    const objectId = new ObjectId(id);
    const updatedTask = req.body;
    delete updatedTask._id; // Empêcher le client de changer le _id

    const result = await tasksCollection.findOneAndUpdate(
      { _id: objectId },
      { $set: updatedTask }
    );
    if (result) {
      res.json(result);  // Envoie le document mis à jour
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE : Supprimer une tâche par ID
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Format d'ID invalide" });
    }

    const objectId = new ObjectId(id);
    const result = await tasksCollection.deleteOne({ _id: objectId });
    if (result.deletedCount === 1) {
      res.status(204).send(); // Aucun contenu à renvoyer
    } else {
      res.status(404).json({ message: "Tâche non trouvée" });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(400).json({ message: error.message });
  }
});

// Démarrer le serveur et écouter sur le port configuré
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port : ${PORT}`);
});

// Servir les fichiers statiques de l'application React
app.use(express.static("dist"));

// Rediriger toutes les autres requêtes vers index.html pour la gestion du routage côté client
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});
