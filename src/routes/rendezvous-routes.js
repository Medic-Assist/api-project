const express = require("express");
const router = express.Router();
const pool = require("../db");

// Obtenir tous les utilisateurs
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM RDV");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Ajouter un utilisateur
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = await pool.query(
      "INSERT INTO Utilisateur (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Obtenir un utilisateur par ID
router.get("/patient/:idUser", async (req, res) => {
  try {
    const { idUser } = req.params;
    const rdv = await pool.query("SELECT * FROM RDV WHERE idUser = $1", [idUser]);
   
    if (rdv.rows.length === 0) {
      return res.status(404).send("Aucun Rendez-Vous");
    }
    res.json(rdv.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Mettre à jour un utilisateur
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    await pool.query("UPDATE Utilisateur SET name = $1, email = $2 WHERE id = $3", [
      name,
      email,
      id,
    ]);
    res.send("User updated");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Supprimer un utilisateur
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM Utilisateur WHERE id = $1", [id]);
    res.send("User deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
