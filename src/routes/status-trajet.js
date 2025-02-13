const express = require("express");
const router = express.Router();
const pool = require("../db");

router.put("/:id", async (req, res) => {
    try {
        let { id } = req.params;
        const { intituleEtat } = req.body;
        
        console.log(`ID reçu: ${id}`);
        console.log(`Intitulé reçu: ${intituleEtat}`);

        // Vérification que ID est un entier
        id = parseInt(id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: "L'ID du rendez-vous est invalide." });
        }



        // Vérifier si l'état existe
        const etatResult = await pool.query(
            "SELECT idEtat FROM EtatRDV WHERE intitule = $1",
            [intituleEtat]
        );

        let idEtat = parseInt(etatResult.rows[0].idetat, 10);

        if (isNaN(idEtat)) {
            return res.status(500).json({ error: "ID d'état invalide." });
        }

        // Mise à jour du statut du rendez-vous
        const updateResult = await pool.query(
            "UPDATE StatusTrajet SET etatRDV = $1 WHERE idRdv = $2 RETURNING *",
            [idEtat, id]
        );

        if (updateResult.rowCount === 0) {
            return res.status(404).json({ error: "Aucun rendez-vous mis à jour." });
        }

        res.json({ message: `Statut du rendez-vous ${id} mis à jour avec succès à '${intituleEtat}'` });

    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut:", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
});

module.exports = router;
