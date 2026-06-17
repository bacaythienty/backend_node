const Question = require('../models/question.model');

// Créer une question
exports.createQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    const question = await Question.create({
      title,
      description,
      tags,
      author: req.user.id,
    });

    res.status(201).json({
      message: 'Question créée avec succès',
      question,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la création',
      error: error.message,
    });
  }
};

// Liste des questions
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('author', 'prenom nom email')
      .sort({ createdAt: -1 });

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Détail d'une question
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'prenom nom email');

    if (!question) {
      return res.status(404).json({
        message: 'Question introuvable',
      });
    }

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Modifier une question
exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: 'Question introuvable',
      });
    }

    if (question.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Accès refusé',
      });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Supprimer une question
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: 'Question introuvable',
      });
    }

    if (question.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Accès refusé',
      });
    }

    await Question.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Question supprimée',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};