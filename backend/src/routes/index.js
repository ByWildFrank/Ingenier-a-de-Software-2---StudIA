const express = require('express');
const router = express.Router();

router.use('/materias', require('./materias.routes'));
// router.use('/unidades', require('./unidades.routes')); // TODO: Create this file
router.use('/apuntes', require('./apuntes.routes'));
router.use('/flashcards', require('./flashcards.routes'));
router.use('/respuestas', require('./respuestas.routes'));
router.use('/dashboard', require('./dashboard.routes'));

router.use('/auth', require('./auth.routes'));

module.exports = router;
