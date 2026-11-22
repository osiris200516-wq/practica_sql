const express = require('express');
const router = express.Router();
const ProductosControlador = require('../controlador/productosControlador');

router.get('/', ProductosControlador.obtenerProductos);
router.get('/con-categoria', ProductosControlador.obtenerProductosConCategoria);
router.get('/:id', ProductosControlador.obtenerProductoPorId);
router.post('/', ProductosControlador.crearProducto);
router.put('/:id', ProductosControlador.actualizarProducto);
router.delete('/:id', ProductosControlador.eliminarProducto);

module.exports = router;