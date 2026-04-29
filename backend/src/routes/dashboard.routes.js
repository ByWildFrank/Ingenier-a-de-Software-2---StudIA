const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard.controller');

router.get('/stats', controller.obtenerEstadisticas);

module.exports = router;
