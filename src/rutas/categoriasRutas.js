const express = require('express');
const router = express.Router();
const CategoriasControlador = require('../controlador/categoriasControlador');

router.get('/', CategoriasControlador.obtenerCategorias);
router.get('/:id', CategoriasControlador.obtenerCategoriaPorId);
router.post('/', CategoriasControlador.crearCategoria);
router.put('/:id', CategoriasControlador.actualizarCategoria);
router.delete('/:id', CategoriasControlador.eliminarCategoria);

module.exports = router;