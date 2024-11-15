const express = require("express");
const router = express.Router();
const pool = require("../db");

// Obtenir tous les utilisateurs
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM CentreMedical");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Ajouter un centre médical
router.post("/", async (req, res) => {
  try {
    const { nom, numero_rue, rue, codePostal, ville } = req.body;
    const newCM = await pool.query(
      "INSERT INTO CentreMedical (nom, numero_rue, rue, codePostal, ville) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nom, numero_rue, rue, codePostal, ville]
    );
    res.json(newCM.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Obtenir la liste des Personnels med par Centre médical
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT CM.idCentreMed, CM.nom, PM.idUser, U.prenom, U.nom FROM PersonnelMed PM JOIN CentreMedical CM ON CM.idCentreMed = PM.idCentreMed JOIN Utilisateur U ON U.idUser = PM.idUser WHERE CM.idCentreMed = $1", [id]);
    if (user.rows.length === 0) {
      return res.status(404).send("Aucun personnel médical trouvé pour ce centre.");
    }
    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Mettre à jour un utilisateur
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { Prenom, nom, role, numero_tel } = req.body;
    await pool.query("UPDATE Utilisateur SET Prenom=$1, nom=$2, role=$3, numero_tel=$4 WHERE idUser = $5", [
      Prenom, nom, role, numero_tel,
      id,
    ]);
    res.send("Utilisateur modifé.");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Mettre à jour un patient
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { numero_rue_principal,rue_principale, codePostal_principal, ville_principale } = req.body;
    await pool.query("UPDATE Patient SET numero_rue_principal=$1,rue_principale=$2, codePostal_principal=$3, ville_principale=$4 WHERE idUser = $5", [
      numero_rue_principal,rue_principale, codePostal_principal, ville_principale,
      id,
    ]);
    res.send("Patient modifié.");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


// Mettre à jour un personnel med
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { idCentreMed } = req.body;
    await pool.query("UPDATE PersonnelMed SET idCentreMed=$1 WHERE idUser = $2", [
      idCentreMed,
      id,
    ]);
    res.send("Personnel Médecin modifié.");
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
