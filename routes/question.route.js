const express = require('express');
const router = express.Router();

const auth = require('../middleware/user.middleware');

const {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  upVote,
} = require('../controllers/question.controller');

// Créer une question
router.post('/', auth, createQuestion);

// Liste des questions
router.get('/', getQuestions);

// Détail d'une question
router.get('/:id', getQuestionById);

// Modifier une question
router.put('/:id', auth, updateQuestion);

// Supprimer une question
router.delete('/:id', auth, deleteQuestion);

// Voter pour une question
router.post('/:id/upvote', auth, upVote);

module.exports = router;