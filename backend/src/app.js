require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
// Servir archivos estáticos locales de apuntes
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
const testRoutes = require('./routes/test.routes');
app.use('/api/test-db', testRoutes);

app.use('/api', require('./routes'));



module.exports = app;
