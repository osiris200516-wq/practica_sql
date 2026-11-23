const DetallePedidoModelo = require('../modelo/detallepedidoModelo');

class DetallePedidoControlador {
    static async obtenerDetalles(req, res) {
        try {
            if (req.query.id_detalle !== undefined) {
                return DetallePedidoControlador.responderDetallePorId(req.query.id_detalle, res);
            }

            const detalles = await DetallePedidoModelo.obtenerTodos();
            return res.status(200).json({
                exito: true,
                mensaje: 'Detalles de pedido obtenidos correctamente',
                datos: detalles
            });
        } catch (error) {
            console.error('Error al obtener detalles de pedido:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al obtener los detalles de pedido'
            });
        }
    }

    static async obtenerDetallePorId(req, res) {
        return DetallePedidoControlador.responderDetallePorId(req.params.id, res);
    }

    static async responderDetallePorId(id, res) {
        try {
            const detalle = await DetallePedidoModelo.obtenerPorId(id);

            if (!detalle) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Detalle de pedido no encontrado'
                });
            }

            return res.status(200).json({
                exito: true,
                mensaje: 'Detalle de pedido obtenido correctamente',
                datos: detalle
            });
        } catch (error) {
            console.error('Error al obtener detalle por ID:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al obtener el detalle de pedido'
            });
        }
    }
    static async obtenerDetallePorPedido(req, res) {
        try {
            const detalles = await DetallePedidoModelo.obtenerDetallePorPedido(req.params.id);

            if (detalles.length === 0) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'No se encontraron detalles para el pedido indicado'
                });
            }

            return res.status(200).json({
                exito: true,
                mensaje: 'Detalle del pedido obtenido correctamente',
                datos: detalles
            });
        } catch (error) {
            console.error('Error al obtener detalle por pedido:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al obtener el detalle del pedido'
            });
        }
    }

    static async obtenerResumenPorProducto(req, res) {
        try {
            const resumen = await DetallePedidoModelo.obtenerResumenPorProducto();
            return res.status(200).json({
                exito: true,
                mensaje: 'Resumen de ventas por producto obtenido correctamente',
                datos: resumen
            });
        } catch (error) {
            console.error('Error al obtener resumen por producto:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al obtener el resumen de las ventas por productos'
            });
        }
    }

    static async crearDetalle(req, res) {
        const { id_pedido, id_producto, cantidad, precio_unitario } = req.body || {};

        if (!Number.isInteger(Number(id_pedido)) || Number(id_pedido) <= 0) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El id_pedido es obligatorio y debe ser un número entero válido'
            });
        }

        if (!Number.isInteger(Number(id_producto)) || Number(id_producto) <= 0) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El id_producto es obligatorio y debe ser un número entero válido'
            });
        }

        if (!Number.isInteger(Number(cantidad)) || Number(cantidad) <= 0) {
            return res.status(400).json({
                exito: false,
                mensaje: 'La cantidad es obligatoria y debe ser un número entero mayor a 0'
            });
        }

        if (precio_unitario === undefined || isNaN(Number(precio_unitario)) || Number(precio_unitario) < 0) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El precio_unitario es obligatorio y debe ser un valor numérico mayor o igual a 0'
            });
        }

        try {
            const detalle = await DetallePedidoModelo.crearDetalle({
                id_pedido: Number(id_pedido),
                id_producto: Number(id_producto),
                cantidad: Number(cantidad),
                precio_unitario: Number(precio_unitario)
            });

            return res.status(201).json({
                exito: true,
                mensaje: 'Detalle de pedido creado correctamente',
                datos: detalle
            });
        } catch (error) {
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El pedido (id_pedido) o el producto (id_producto) indicado no existe'
                });
            }
            console.error('Error al crear detalle de pedido:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al crear el detalle de pedido'
            });
        }
    }

    static async actualizarDetalle(req, res) {
        const datos = req.body || {};
        const datosLimpios = {};

        if (datos.id_pedido !== undefined) {
            if (!Number.isInteger(Number(datos.id_pedido)) || Number(datos.id_pedido) <= 0) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El id_pedido debe ser un número entero válido'
                });
            }
            datosLimpios.id_pedido = Number(datos.id_pedido);
        }

        if (datos.id_producto !== undefined) {
            if (!Number.isInteger(Number(datos.id_producto)) || Number(datos.id_producto) <= 0) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El id_producto debe ser un número entero válido'
                });
            }
            datosLimpios.id_producto = Number(datos.id_producto);
        }

        if (datos.cantidad !== undefined) {
            if (!Number.isInteger(Number(datos.cantidad)) || Number(datos.cantidad) <= 0) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'La cantidad debe ser un número entero mayor a 0'
                });
            }
            datosLimpios.cantidad = Number(datos.cantidad);
        }

        if (datos.precio_unitario !== undefined) {
            if (isNaN(Number(datos.precio_unitario)) || Number(datos.precio_unitario) < 0) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El precio_unitario debe ser un valor numérico mayor o igual a 0'
                });
            }
            datosLimpios.precio_unitario = Number(datos.precio_unitario);
        }

        try {
            const detalleActualizado = await DetallePedidoModelo.actualizarDetalle(req.params.id, datosLimpios);
            if (!detalleActualizado) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Detalle de pedido no encontrado'
                });
            }

            return res.status(200).json({
                exito: true,
                mensaje: 'Detalle de pedido actualizado correctamente',
                datos: detalleActualizado
            });
        } catch (error) {
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El pedido (id_pedido) o el producto (id_producto) indicado no existe'
                });
            }
            console.error('Error al actualizar detalle de pedido:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al actualizar el detalle de pedido'
            });
        }
    }

    static async eliminarDetalle(req, res) {
        try {
            const eliminado = await DetallePedidoModelo.eliminarDetalle(req.params.id);
            if (!eliminado) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Detalle de pedido no encontrado'
                });
            }

            return res.status(200).json({
                exito: true,
                mensaje: 'Detalle de pedido eliminado correctamente'
            });
        } catch (error) {
            console.error('Error al eliminar detalle de pedido:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al eliminar el detalle de pedido'
            });
        }
    }
}

module.exports = DetallePedidoControlador;