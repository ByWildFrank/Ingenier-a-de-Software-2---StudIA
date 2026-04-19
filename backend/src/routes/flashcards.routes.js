const express = require('express');
const router = express.Router();
const controller = require('../controllers/flashcards.controller');

router.get('/unidad/:unidadId', controller.getByUnidad);
router.post('/', controller.create);

module.exports = router;
