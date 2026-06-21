const Question = require('../models/question.model'); 
const commentaireController = require('./commentaire.controller');
const Commentaire = require('../models/commentaire.model');

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

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Récupérer toutes les questions
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("author", "prenom nom email")
      .sort({ createdAt: -1 });

    const data = await Promise.all(
      questions.map(async (question) => {
        const commentairesCount =
          await Commentaire.countDocuments({
            question: question._id,
          });

        return {
          ...question.toObject(),
          commentairesCount,
        };
      })
    );

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Récupérer une question par ID
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("author", "prenom nom email");

    if (!question) {
      return res.status(404).json({
        message: "Question introuvable",
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

    question.title = req.body.title || question.title;
    question.description =
      req.body.description || question.description;
    question.tags = req.body.tags || question.tags;

    await question.save();

    res.status(200).json(question);
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

    await question.deleteOne();

    res.status(200).json({
      message: 'Question supprimée avec succès',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Voter pour une question
exports.upVote = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: 'Question introuvable',
      });
    }

    const userId = req.user.id;

    if (question.voters.includes(userId)) {
      return res.status(400).json({
        message: 'Vous avez déjà voté',
      });
    }

    question.votes += 1;
    question.voters.push(userId);

    await question.save();

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("author", "prenom nom email")
      .sort({ createdAt: -1 });

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("author", "prenom nom email")
      .sort({ createdAt: -1 });

    const result = await Promise.all(
      questions.map(async (question) => {
        const commentairesCount =
          await Commentaire.countDocuments({
            question: question._id,
          });

        return {
          ...question.toObject(),
          commentairesCount,
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};