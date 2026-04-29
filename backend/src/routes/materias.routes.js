const express = require('express');
const router = express.Router();
const controller = require('../controllers/materias.controller');

router.get('/', controller.obtenerTodas);
router.get('/stats', controller.obtenerConEstadisticas);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

module.exports = router;
