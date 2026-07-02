const Question = require("../models/question.model");
const Commentaire = require("../models/commentaire.model");

// =======================
// Créer une question
// =======================
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

// =======================
// Liste des questions
// =======================
exports.getQuestions = async (req, res) => {
  try {
    const { tri, tag, recherche } = req.query;

    let filtre = {};

    // Recherche par tag
    if (tag) {
      filtre.tags = { $regex: tag, $options: "i" };
    }

    // Recherche par titre
    if (recherche) {
      filtre.title = { $regex: recherche, $options: "i" };
    }

    // Tri
    let triMongo = { createdAt: -1 };

    switch (tri) {
      case "ancien":
        triMongo = { createdAt: 1 };
        break;

      case "vote":
        triMongo = { votes: -1 };
        break;

      default:
        triMongo = { createdAt: -1 };
    }

    const questions = await Question.find(filtre)
      .populate("author", "prenom nom email")
      .sort(triMongo);

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

    // Tri par nombre de commentaires
    if (tri === "commentaire") {
      result.sort(
        (a, b) =>
          b.commentairesCount - a.commentairesCount
      );
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================
// Détail d'une question
// =======================
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

// =======================
// Modifier une question
// =======================
exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: "Question introuvable",
      });
    }

    if (question.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Accès refusé",
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

// =======================
// Supprimer une question
// =======================
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: "Question introuvable",
      });
    }

    if (question.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Accès refusé",
      });
    }

    await Commentaire.deleteMany({
      question: question._id,
    });

    await question.deleteOne();

    res.json({
      message: "Question supprimée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================
// Voter
// =======================
exports.upVote = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question introuvable" });
    }

    const userId = req.user.id;

    // déjà upvoté
    if (question.upvoters.includes(userId)) {
      return res.status(400).json({ message: "Déjà upvoté" });
    }

    // retirer du downvote si existait
    question.downvoters = question.downvoters.filter(
      (id) => id.toString() !== userId
    );

    question.votes += 1;
    question.upvoters.push(userId);
    console.log("Upvoters:", question.upvoters);
    console.log("Downvoters:", question.downvoters);

    await question.save();

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

     exports.downVote = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question introuvable" });
    }

    const userId = req.user.id;

    // déjà downvoté
    if (question.downvoters.includes(userId)) {
      return res.status(400).json({ message: "Déjà dévoté" });
    }

    // retirer upvote si existait
    question.upvoters = question.upvoters.filter(
      (id) => id.toString() !== userId
    );

    question.votes -= 1;
    question.downvoters.push(userId);
    console.log("Upvoters:", question.upvoters);
    console.log("Downvoters:", question.downvoters);

    await question.save();

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};