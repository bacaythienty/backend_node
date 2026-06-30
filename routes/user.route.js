const express = require("express");

const router = express.Router();

const auth = require("../middleware/user.middleware");

const {

  inscription,
  connexion,
  getProfil,
  updateProfil

} = require("../controllers/user.controller");


// inscription

router.post("/inscription", inscription);


// connexion

router.post("/connexion", connexion);


// récupérer le profil

router.get("/profil", auth, getProfil);


// modifier le profil

router.put("/profil", auth, updateProfil);


module.exports = router;