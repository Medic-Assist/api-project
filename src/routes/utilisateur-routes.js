const express = require("express");
const router = express.Router();
const pool = require("../db");

// Obtenir tous les utilisateurs
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Utilisateur");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Obtenir tous les proches
router.get("/proches", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Utilisateur U INNER JOIN Proche P ON P.idUser=U.idUser");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Ajouter un utilisateur
router.post("/", async (req, res) => {
  try {
    const { prenom, nom, numero_tel, role } = req.body;

    // Vérification des champs requis
    if (!prenom || !nom || !numero_tel || !role) {
      return res.status(400).send("Tous les champs requis doivent être remplis.");
    }

    const newUser = await pool.query(
      "INSERT INTO Utilisateur (prenom, nom, numero_tel, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [prenom, nom, numero_tel, role]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur : " + err.message);
  }
});


// Ajouter un Patient
router.post("/patient", async (req, res) => {
  try {
    const { idUser,numero_rue_principal, rue_principale, codePostal_principal, ville_principale } = req.body;
    const newUser = await pool.query(
      "INSERT INTO Patient (idUser,  numero_rue_principal,rue_principale,  codePostal_principal, ville_principale) VALUES ($1, $2, $3, $4,$5) RETURNING *",
      [idUser, numero_rue_principal,rue_principale, codePostal_principal, ville_principale]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
// Ajouter un Proche
router.post("/proche", async (req, res) => {
  try {
    const { iduser,mail } = req.body;
    const newUser = await pool.query(
      "INSERT INTO Proche (idUser,mail) VALUES ($1, $2) RETURNING *",
      [iduser,mail]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Ajouter une relation Proche_Patient
router.post("/proche_patient", async (req, res) => {
  try {
    const { idPatient, idProche } = req.body;
    const newUser = await pool.query(
      "INSERT INTO Proche_Patient (idPatient, idProche) VALUES ($1, $2) RETURNING *",
      [idPatient, idProche]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Ajouter un Personnel Médical
router.post("/personnelMed", async (req, res) => {
  try {
    const { idUser, idCentreMed } = req.body;
    const newUser = await pool.query(
      "INSERT INTO PersonnelMed (idUser, idCentreMed) VALUES ($1, $2) RETURNING *",
      [idUser, idCentreMed]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Obtenir un utilisateur par ID
/*
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM Utilisateur WHERE idUser = $1", [id]);
    if (user.rows.length === 0) {
      return res.status(404).send("User not found");
    }
    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});*/

// Obtenir un patient par ID
router.get("/patient/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM Utilisateur U LEFT JOIN Patient P ON P.idUser = U.idUser WHERE U.idUser = $1",
       [id]);
    if (user.rows.length === 0) {
      return res.status(404).send("User not found");
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Obtenir un proche par ID
router.get("/proche/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM Utilisateur U LEFT JOIN Proche P ON P.idUser = U.idUser WHERE U.idUser = $1", [id]);
    if (user.rows.length === 0) {
      return res.status(404).send("User not found");
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Obtenir un personnel Med par ID
router.get("/personnelMed/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM Utilisateur U LEFT JOIN PersonnelMed P ON P.idUser = U.idUser WHERE U.idUser = $1", [id]);
    if (user.rows.length === 0) {
      return res.status(404).send("User not found");
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Obtenir les proches de patient par ID
router.get("/proches_patient/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM Proche_Patient PP JOIN Proche Pro ON Pro.idUser = PP.idProche JOIN Utilisateur U ON U.idUser = Pro.idUser WHERE PP.idPatient = $1", [id]);
    if (user.rows.length === 0) {
      return res.status(404).send("Aucun proche trouvé");
    }
    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Obtenir les patients surveillé des proches par ID
router.get("/patients_proche/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM Proche_Patient PP JOIN Patient Pa ON Pa.idUser = PP.idPatient JOIN Utilisateur U ON U.idUser = Pa.idUser WHERE PP.idProche = $1", [id]);
    if (user.rows.length === 0) {
      return res.status(404).send("Aucun patient trouvé.");
    }
    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Obtenir tous les modes de transports disponibles
router.get("/modes_transports", async (req, res) => {
  try {
    const modes = await pool.query("SELECT unnest(enum_range(NULL::mode_transport)) AS transport_mode");
    res.json(modes.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});




//Mettre à jour les informations d'un utilisateur
router.put("/nom/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { newNom, newPrenom } = req.body;
    await pool.query("UPDATE Utilisateur SET nom = $1, prenom = $2 WHERE idUser =$3", [
      newNom, newPrenom,
      id,
    ]);
    res.send("User updated");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Mettre à jour les informations d'un patient
router.put("/patient/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom,numero_tel, mail, date_naissance, numero_rue_principal, rue_principale, codepostal_principal, ville_principale, modeTransport } = req.body;

    // Commencer une transaction pour garantir que les deux mises à jour se fassent correctement
    await pool.query('BEGIN');

    // Mettre à jour l'utilisateur (nom, prénom et numero de tel)
    await pool.query(
      "UPDATE Utilisateur SET nom = $1, prenom = $2, numero_tel = $3 WHERE idUser = $4", 
      [nom, prenom,numero_tel, id]
    );

    // Mettre à jour les informations du patient
    await pool.query(
      "UPDATE Patient SET mail = $1, date_naissance = $2, numero_rue_principal = $3, rue_principale = $4, codePostal_principal = $5, ville_principale = $6, modeTransport = $7 WHERE idUser = $8", 
      [mail, date_naissance, numero_rue_principal, rue_principale, codepostal_principal, ville_principale, modeTransport, id]
    );

    // Si tout s'est bien passé, valider la transaction
    await pool.query('COMMIT');
  
    res.send("Utilisateur et Patient mis à jour.");
  } catch (err) {
    // En cas d'erreur, annuler la transaction
    await pool.query('ROLLBACK');
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Mettre à jour les informations d'un patient
router.put("/proche/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom,numero_tel, mail } = req.body;

    //Verification de l'existence du proche
    const result = await pool.query("SELECT * FROM Proche WHERE idUser = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).send("Proche not found");
    }
    // Commencer une transaction pour garantir que les deux mises à jour se fassent correctement
    await pool.query('BEGIN');

    // Mettre à jour l'utilisateur (nom, prénom et numero de tel)
    await pool.query(
      "UPDATE Utilisateur SET nom = $1, prenom = $2, numero_tel = $3 WHERE idUser = $4", 
      [nom, prenom,numero_tel, id]
    );

    // Mettre à jour les informations du proche
    await pool.query(
      "UPDATE Proche SET mail = $1 WHERE idUser = $2", 
      [mail, id]
    );

    // Si tout s'est bien passé, valider la transaction
    await pool.query('COMMIT');
    
    res.send("Utilisateur et Proche mis à jour.");
  } catch (err) {
    // En cas d'erreur, annuler la transaction
    try {
      await pool.query('ROLLBACK');
    } catch (rollbackErr) {
      console.error("Erreur lors du rollback :", rollbackErr.message);
    }
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// ajouter une adresse temporaire au Patient par ID
router.put("/adresseTMP/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { newNumero,newRue, newCP, newVille } = req.body;
    await pool.query("UPDATE Patient SET numero_rue_temporaire=$1, rue_temporaire = $2,codePostal_temporaire = $3,ville_temporaire = $4 WHERE idUser = $5"+
      "UPDATE RDV SET isADRPrincipal = FALSE WHERE dateRDV = CURDATE() AND idUser = $5", [
        newNumero,newRue, newCP, newVille,
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
    await pool.query("DELETE FROM Utilisateur WHERE idUser = $1", [id]);
    res.send("User deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Supprimer un utilisateur
router.delete("/proche/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM Proche WHERE idUser = $1", [id]);
    res.status(200).send("Proche supprimé avec succès.");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
