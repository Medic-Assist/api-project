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
    const { intitule,horaire, dateRDV, idUser, idBulleRainbow, idCentreMed, isADRPrincipale, idDoctor } = req.body;
    const newRDV = await pool.query(
      "INSERT INTO RDV (intitule,horaire, dateRDV, idUser, idBulleRainbow, idCentreMed, isADRPrincipale, idDoctor) VALUES ($1, $2,$3,$4,$5,$6, $7,$8) RETURNING *",
      [intitule,horaire, dateRDV, idUser, idBulleRainbow, idCentreMed, isADRPrincipale, idDoctor]
    );

    const idRDV = parseInt(newRDV.rows[0].idrdv, 10);
    // Assigner le statut initial ("Prévu")
    await pool.query(
      "INSERT INTO StatusTrajet (idRdv, etatRDV) VALUES ($1, (SELECT idEtat FROM EtatRDV WHERE intitule = 'Prévu'))",
      [idRDV]
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
    await pool.query("UPDATE RDV SET horaire = $1, dateRDV = $2 WHERE idUser = $3 AND idRDV = $4", [
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
    await pool.query("UPDATE RDV SET isADRPrincipal = FALSE WHERE dateRDV = CURRENT_DATE() AND idUser = $1", 
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

// Obtenir le personnel médical référent à mon RDV par idRDV
router.get("/personnelMed/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT PM.idUser, U.prenom, U.nom FROM RDV  LEFT JOIN PersonnelMed PM ON PM.idCentreMed = RDV.idCentreMed LEFT JOIN Utilisateur U ON U.idUser = PM.idUser WHERE RDV.idRDV = $1", [id]);
    if (user.rows.length === 0) {
      return res.status(404).send("Aucun personnel médical trouvé");
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Obtenir les différents etats possible du Rdv
router.get("/etatsRdv", async (req, res) => {
  try {
    
    const user = await pool.query("SELECT * FROM EtatRDV", );
    if (user.rows.length === 0) {
      return res.status(404).send("Aucun etat de RDV trouvé");
    }
    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Obtenir les status pour un Rdv
router.get("/statusTrajet/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT E.idEtat, E.intitule FROM StatusTrajet S JOIN EtatRDV E ON E.idEtat=S.etatRDV WHERE idRdv= $1", [id]);
    if (user.rows.length === 0) {
      return res.status(404).send("Aucun status de trajet trouvé pour ce Rdv");
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Mettre à jour le statut d'un rendez-vous en utilisant une phrase d'état
router.put("/statusTrajet/:idRDV", async (req, res) => {
  try {
    console.log("🔍 [DEBUG] Requête reçue pour mise à jour du statut");

    let { idRDV } = req.params;
    const { intituleEtat } = req.body;

    console.log(`📌 [DEBUG] idRDV reçu: ${idRDV}`);
    console.log(`📌 [DEBUG] intituleEtat reçu: ${intituleEtat}`);

    // Vérification des paramètres
    if (!idRDV || !intituleEtat) {
      console.error("❌ [ERREUR] Paramètres manquants");
      return res.status(400).json({ message: "ID du rendez-vous et intitule de l'état sont requis." });
    }

    // 🔹 Vérifier et convertir en entier
    idRDV = parseInt(idRDV, 10);
    if (isNaN(idRDV)) {
      console.error("❌ [ERREUR] idRDV n'est pas un entier valide !");
      return res.status(400).json({ message: "L'ID du rendez-vous doit être un entier valide." });
    }

    // 1️⃣ Récupérer l'ID de l'état correspondant à la phrase donnée
    const etatResult = await pool.query(
      "SELECT idEtat FROM EtatRDV WHERE intitule = $1",
      [intituleEtat]
    );

    console.log(`🧐 [DEBUG] Résultat de la requête SELECT: ${JSON.stringify(etatResult.rows)}`);

    if (etatResult.rows.length === 0) {
      console.warn(`⚠️ [AVERTISSEMENT] État '${intituleEtat}' non trouvé.`);
      return res.status(404).json({ message: "État non trouvé. Vérifiez la phrase passée." });
    }

    let idEtat = parseInt(etatResult.rows[0].idEtat, 10);

    // 🔹 Vérifier si `idEtat` est bien un entier
    if (typeof idEtat !== "number") {
      console.error(`❌ [ERREUR] idEtat (${idEtat}) n'est pas un entier valide !`);
      return res.status(500).json({ message: "Erreur interne : ID d'état invalide." });
    }

    console.log(`✅ [DEBUG] ID de l'état trouvé: ${idEtat}`);

    // 2️⃣ Mettre à jour le statut du rendez-vous
    const updateResult = await pool.query(
      "UPDATE StatusTrajet SET etatRDV = $1 WHERE idRdv = $2 RETURNING *",
      [idEtat, idRDV]
    );

    console.log(`📝 [DEBUG] Résultat de la requête UPDATE: ${JSON.stringify(updateResult.rows)}`);

    if (updateResult.rowCount === 0) {
      console.warn(`⚠️ [AVERTISSEMENT] Aucun rendez-vous mis à jour pour idRDV: ${idRDV}`);
      return res.status(404).json({ message: "Aucun rendez-vous trouvé avec cet ID." });
    }

    res.json({ message: `Statut du rendez-vous ${idRDV} mis à jour avec succès à '${intituleEtat}'` });

  } catch (err) {
    console.error(`❌ [ERREUR] Une exception s'est produite: ${err.message}`);
    res.status(500).json({ 
      message: "Erreur serveur lors de la mise à jour du statut du rendez-vous.", 
      error: err.message 
    });
  }
});




module.exports = router;

