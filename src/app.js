const express = require("express");
const app = express();

// Middleware pour permettre de parser les données JSON dans les requêtes
app.use(express.json());

// Définir une route simple
app.get("/", (req, res) => {
  res.send("Bienvenue sur mon API Node.js!");
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Le serveur est démarré sur le port ${PORT}`);
});
