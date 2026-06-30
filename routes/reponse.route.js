const express = require("express");
const router = express.Router();

const auth = require("../middleware/user.middleware");

const {
  createReponse,
  getReponses,
  deleteReponse,
} = require("../controllers/reponse.controller");

// Ajouter une réponse à une question
router.post("/question/:questionId", auth, createReponse);

// Voir les réponses d'une question
router.get("/question/:questionId", getReponses);

// Supprimer une réponse
router.delete("/:id", auth, deleteReponse);

module.exports = router;