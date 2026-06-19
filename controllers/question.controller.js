const {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  upVote,
} = require('../controllers/question.controller');

exports.upVote = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: "Question introuvable",
      });
    }

    const userId = req.user.id;

    if (question.voters.includes(userId)) {
      return res.status(400).json({
        message: "Vous avez déjà voté",
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
exports.upVote = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: "Question introuvable",
      });
    }

    const userId = req.user.id;

    if (question.voters.includes(userId)) {
      return res.status(400).json({
        message: "Vous avez déjà voté",
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