const User = require("../models/user.model");
const Question = require("../models/question.model");
const Reponse = require("../models/reponse.model");
const Commentaire = require("../models/commentaire.model");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ==================== INSCRIPTION ====================

exports.inscription = async (req, res) => {
  try {

    const { prenom, nom, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "Utilisateur existe déjà"
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      prenom,
      nom,
      email,
      password: hashPassword
    });

    res.status(201).json({
      message: "Inscription réussie"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// ==================== CONNEXION ====================

exports.connexion = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Utilisateur introuvable"
      });
    }

    const compare = await bcrypt.compare(
      password,
      user.password
    );

    if (!compare) {

      return res.status(400).json({
        message: "Mot de passe incorrect"
      });

    }

    const token = jwt.sign(

      {
        id: user._id
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1d"
      }

    );

    res.json({

      token,

      user: {

        id: user._id,
        prenom: user.prenom,
        nom: user.nom,
        email: user.email

      }

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// ==================== PROFIL ====================

exports.getProfil = async (req, res) => {

  try {

    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {

      return res.status(404).json({
        message: "Utilisateur introuvable"
      });

    }

    const questions = await Question.countDocuments({
      author: req.user.id
    });

    const reponses = await Reponse.countDocuments({
      auteur: req.user.id
    });

    const commentaires = await Commentaire.countDocuments({
      auteur: req.user.id
    });

    res.json({

      ...user.toObject(),

      questions,

      reponses,

      commentaires,

      reputation: questions * 5 + reponses * 10

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// ==================== MODIFIER PROFIL ====================

exports.updateProfil = async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    if (!user) {

      return res.status(404).json({
        message: "Utilisateur introuvable"
      });

    }

    user.prenom = req.body.prenom || user.prenom;
    user.nom = req.body.nom || user.nom;
    user.email = req.body.email || user.email;

    await user.save();

    res.json({

      message: "Profil modifié avec succès",

      user

    });

  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};