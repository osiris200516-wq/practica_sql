const express = require('express');
const router = express.Router();
const DetallePedidoControlador = require('../controlador/detallepedidoControlador');

router.get('/', DetallePedidoControlador.obtenerDetalles);
router.get('/resumen/productos', DetallePedidoControlador.obtenerResumenPorProducto);
router.get('/pedido/:id', DetallePedidoControlador.obtenerDetallePorPedido);
router.get('/:id', DetallePedidoControlador.obtenerDetallePorId);
router.post('/', DetallePedidoControlador.crearDetalle);
router.put('/:id', DetallePedidoControlador.actualizarDetalle);
router.delete('/:id', DetallePedidoControlador.eliminarDetalle);

module.exports = router;