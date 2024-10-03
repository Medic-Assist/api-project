const express = require("express");
const pool = require("./db");
const userRoutes = require("./routes/user-routes");
const path = require("path");
const app = express();
const port = 3000;

// Middleware pour traiter les requêtes en JSON
app.use(express.json());

// Définir les routes
app.use("/api/users", userRoutes);


app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
