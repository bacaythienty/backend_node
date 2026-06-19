const Commentaire = require("../models/commentaire.model");

exports.createCommentaire = async (req, res) => {
  try {
    const commentaire = await Commentaire.create({
      contenu: req.body.contenu,
      auteur: req.user.id,
      question: req.params.questionId,
    });

    res.status(201).json(commentaire);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getCommentaires = async (req, res) => {
  try {
    const commentaires = await Commentaire.find({
      question: req.params.questionId,
    }).populate("auteur", "prenom nom");

    res.status(200).json(commentaires);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};