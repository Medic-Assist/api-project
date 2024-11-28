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

// Ajouter un utilisateur
router.post("/", async (req, res) => {
  try {
    const { Prenom, nom,role } = req.body;
    const newUser = await pool.query(
      "INSERT INTO Utilisateur (Prenom, nom, role) VALUES ($1, $2, $3) RETURNING *",
      [Prenom, nom, role]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
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
    const { idUser,numero_rue, rue,codePostal,ville } = req.body;
    const newUser = await pool.query(
      "INSERT INTO Proche (idUser,numero_rue, rue,codePostal,ville) VALUES ($1, $2, $3, $4,$5) RETURNING *",
      [idUser,numero_rue, rue,codePostal,ville]
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
});

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


  // Obtenir un utilisateur par email
router.get("/email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await pool.query("SELECT * FROM Utilisateur WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(404).send("User not found");
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Ajouter un mapping UserRainbow
router.post("/user_rainbow", async (req, res) => {
  try {
    const { idRainbow, idUser } = req.body;
    const newUserRainbow = await pool.query(
      "INSERT INTO userrainbow (idRainbow, idUser) VALUES ($1, $2) RETURNING *",
      [idRainbow, idUser]
    );
    res.json(newUserRainbow.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
