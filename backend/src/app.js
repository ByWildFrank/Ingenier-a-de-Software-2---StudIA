const express = require('express');
const app = express();

app.use(express.json());

// Rutas
const testRoutes = require('./routes/test.routes');
app.use('/api/test-db', testRoutes);

module.exports = app;
