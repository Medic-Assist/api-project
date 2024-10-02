const express = require("express");
const pool = require("./db");
const userRoutes = require("./routes/user-routes");

const app = express();
const port = 3000;

// Middleware pour traiter les requêtes en JSON
app.use(express.json());

// Définir les routes
app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/api", (req, res) => {
  res.send("Hello World API!");
});
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
