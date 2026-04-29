const express = require('express');
const router = express.Router();
const { obtenerConexion } = require('../database/db');

router.get('/', async (req, res) => {
    try {
        const pool = await obtenerConexion();
        const result = await pool.request().query('SELECT 1 AS conectado');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Error conectando a la BD', detalle: error });
    }
});

module.exports = router;
