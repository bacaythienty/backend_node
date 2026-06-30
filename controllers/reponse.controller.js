const Reponse = require("../models/reponse.model");

exports.createReponse = async (req, res) => {
  try {
    const reponse = await Reponse.create({
      contenu: req.body.contenu,
      auteur: req.user.id,
      question: req.params.questionId,
    });

    res.status(201).json(reponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getReponses = async (req, res) => {
  try {
    const reponses = await Reponse.find({
      question: req.params.questionId,
    }).populate("auteur", "prenom nom");

    res.status(200).json(reponses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteReponse = async (req, res) => {
  try {
    await Reponse.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Réponse supprimée",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};