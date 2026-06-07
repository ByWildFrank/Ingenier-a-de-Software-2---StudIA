const express = require('express');
const router = express.Router();
const controller = require('../controllers/respuestas.controller');

router.get('/flashcard/:flashcardId', controller.obtenerPorFlashcard);
router.post('/', controller.crear);

module.exports = router;
