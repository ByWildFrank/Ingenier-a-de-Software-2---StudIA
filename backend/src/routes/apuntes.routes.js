const express = require('express');
const router = express.Router();
const controller = require('../controllers/apuntes.controller');

router.get('/unidad/:unidadId', controller.getByUnidad);
router.post('/', controller.create);

module.exports = router;
