const express = require('express');
const router = express.Router();
const controller = require('../controllers/respuestas.controller');

router.get('/flashcard/:flashcardId', controller.getByFlashcard);
router.post('/', controller.create);

module.exports = router;
