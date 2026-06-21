const express = require("express");
const router = express.Router();

const auth = require("../middleware/user.middleware");
const {
  createCommentaire,
  getCommentaires,
} = require("../controllers/commentaire.controller");

router.post("/:questionId", auth, createCommentaire);

router.get("/:questionId", getCommentaires);

module.exports = router;