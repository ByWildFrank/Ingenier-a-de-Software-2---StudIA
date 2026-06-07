const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');

router.post('/login', controller.iniciarSesion);
router.post('/register', controller.registrar);

module.exports = router;
