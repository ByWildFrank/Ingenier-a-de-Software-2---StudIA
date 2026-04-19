const express = require('express');
const router = express.Router();

const flashcardsController = require('../controllers/flashcards.controller');

router.get('/', flashcardsController.getFlashcards);
router.post('/crear', flashcardsController.createFlashcards);

module.exports = router;
