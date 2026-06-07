const express = require('express');
const router = express.Router();
const controller = require('../controllers/flashcards.controller');

router.get('/apunte/:apunteId', controller.obtenerPorApunte);
router.get('/materia/:materiaId', controller.obtenerPorMateria);
router.post('/generate', controller.generar);
router.post('/progress', controller.guardarProgreso);

module.exports = router;
