const express = require("express");
const router = express.Router();
const pool = require("../db");

// Obtenir tous les rendez-vous
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM RDV");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");gi
  }
});

// Ajouter un rendez-vous
router.post("/", async (req, res) => {
  try {
    const { intitule,horaire, dateRDV, idUser, idCentreMed, isADRPrincipale } = req.body;
    const newRDV = await pool.query(
      "INSERT INTO RDV (intitule,horaire, dateRDV, idUser, idCentreMed, isADRPrincipale) VALUES ($1, $2,$3,$4,$5,$6) RETURNING *",
      [intitule,horaire, dateRDV, idUser, idCentreMed, isADRPrincipale]
    );
    res.json(newRDV.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Obtenir la liste de rendez-vous poiur le patient avec l'ID donné
router.get("/patient/:idUser", async (req, res) => {
  try {
    const { idUser } = req.params;
    const rdv = await pool.query("SELECT * FROM RDV LEFT JOIN CentreMedical CM ON CM.idCentreMed = RDV.idCentreMed WHERE idUser = $1", [idUser]);
   
    if (rdv.rows.length === 0) {
      return res.status(404).send("Aucun Rendez-Vous");
    }
    res.json(rdv.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Mettre à jour l'horaire et la date d'un rendez-vous
router.put("/:idUser/:idRDV", async (req, res) => {
  try {
    const { idUser,idRDV } = req.params;
    const { horaire, dateRDV } = req.body;
    await pool.query("UPDATE RDV SET horaire = $1, dateRDV = $2 WHERE idUser = $3 AND idRDV = 1", [
      horaire,
      dateRDV,
      idUser,
      idRDV
    ]);
    res.send("Rendez-vous modifié.");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Mettre à jour l'info de quelle adresse regardé pour un rendez-vous
router.put("/:idUser", async (req, res) => {
  try {
    const { idUser } = req.params;
    await pool.query("UPDATE RDV SET isADRPrincipal = FALSE WHERE dateRDV = CURDATE() AND idUser = $1", 
      [idUser]
    );
    res.send("Rendez-vous modifié.");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Supprimer un rendez-vous
router.delete("/:idRDV", async (req, res) => {
  try {
    const { idRDV } = req.params;
    await pool.query("DELETE FROM RDV WHERE idRDV = $1", [idRDV]);
    res.send("Rendez-vous supprimé.");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
