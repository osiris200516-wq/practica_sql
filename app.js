const express = require('express');
const router = require('./src/rutas/rutas');
const empleadosRouter = require('./src/rutas/empleadosRutas');

const app = express();

app.use(express.json());
app.use('/api/empleados', empleadosRouter);
app.use('/api', router);

module.exports = app;