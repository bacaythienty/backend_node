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

router.post('/', auth, createQuestion);

router.get('/', getQuestions);

router.get('/:id', getQuestionById);

router.put('/:id', auth, updateQuestion);

router.delete('/:id', auth, deleteQuestion);

router.post('/:id/upvote', auth, upVote);

module.exports = router;