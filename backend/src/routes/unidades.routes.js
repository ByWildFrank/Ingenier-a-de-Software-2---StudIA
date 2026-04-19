const express = require('express');
const router = express.Router();
const controller = require('../controllers/unidades.controller');

router.get('/', controller.getAll);
router.get('/materia/:materiaId', controller.getByMateria);
router.post('/', controller.create);

module.exports = router;
