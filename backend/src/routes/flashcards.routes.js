const express = require('express');
const router = express.Router();
const controller = require('../controllers/flashcards.controller');

router.get('/apunte/:apunteId', controller.getByApunte);
router.get('/materia/:materiaId', controller.getByMateria);
router.post('/generate', controller.generate);
router.post('/progress', controller.saveProgress);

module.exports = router;
