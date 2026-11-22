const PedidosModelo = require('../modelo/pedidosModelo');

class PedidosControlador {
    static async obtenerPedidos(req, res) {
        try {
            if (req.query.id_pedido !== undefined) {
                return PedidosControlador.responderPedidoPorId(req.query.id_pedido, res);
            }

            const pedidos = await PedidosModelo.obtenerTodos();
            return res.status(200).json({
                exito: true,
                mensaje: 'Pedidos obtenidos correctamente',
                datos: pedidos
            });
        } catch (error) {
            console.error('Error al obtener pedidos:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al obtener los pedidos'
            });
        }
    }

    static async obtenerPedidoPorId(req, res) {
        return PedidosControlador.responderPedidoPorId(req.params.id, res);
    }

    static async responderPedidoPorId(id, res) {
        try {
            const pedido = await PedidosModelo.obtenerPorId(id);

            if (!pedido) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Pedido no encontrado'
                });
            }

            return res.status(200).json({
                exito: true,
                mensaje: 'Pedido obtenido correctamente',
                datos: pedido
            });
        } catch (error) {
            console.error('Error al obtener pedido por ID:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al obtener el pedido'
            });
        }
    }

    // Endpoint INNER JOIN: pedidos + clientes
    static async obtenerPedidosConCliente(req, res) {
        try {
            const pedidos = await PedidosModelo.obtenerConCliente();
            return res.status(200).json({
                exito: true,
                mensaje: 'Pedidos con nombre de cliente obtenidos correctamente',
                datos: pedidos
            });
        } catch (error) {
            console.error('Error al obtener pedidos con cliente:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al obtener los pedidos con cliente'
            });
        }
    }

    static async crearPedido(req, res) {
        const { id_cliente, id_empleado, fecha_pedido, canal } = req.body || {};

        if (!Number.isInteger(Number(id_cliente)) || Number(id_cliente) <= 0) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El id_cliente es obligatorio y debe ser un número entero válido'
            });
        }

        if (!Number.isInteger(Number(id_empleado)) || Number(id_empleado) <= 0) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El id_empleado es obligatorio y debe ser un número entero válido'
            });
        }

        if (typeof canal !== 'string' || !canal.trim()) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El canal del pedido es obligatorio y debe ser texto'
            });
        }

        try {
            const pedido = await PedidosModelo.crearPedido({
                id_cliente: Number(id_cliente),
                id_empleado: Number(id_empleado),
                fecha_pedido: typeof fecha_pedido === 'string' && fecha_pedido.trim()
                    ? fecha_pedido.trim()
                    : undefined,
                canal: canal.trim()
            });

            return res.status(201).json({
                exito: true,
                mensaje: 'Pedido creado correctamente',
                datos: pedido
            });
        } catch (error) {
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El cliente (id_cliente) o el empleado (id_empleado) indicado no existe'
                });
            }
            console.error('Error al crear pedido:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al crear el pedido'
            });
        }
    }

    static async actualizarPedido(req, res) {
        const datos = req.body || {};
        const datosLimpios = {};

        if (datos.id_cliente !== undefined) {
            if (!Number.isInteger(Number(datos.id_cliente)) || Number(datos.id_cliente) <= 0) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El id_cliente debe ser un número entero válido'
                });
            }
            datosLimpios.id_cliente = Number(datos.id_cliente);
        }

        if (datos.id_empleado !== undefined) {
            if (!Number.isInteger(Number(datos.id_empleado)) || Number(datos.id_empleado) <= 0) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El id_empleado debe ser un número entero válido'
                });
            }
            datosLimpios.id_empleado = Number(datos.id_empleado);
        }

        if (datos.fecha_pedido !== undefined) {
            if (typeof datos.fecha_pedido !== 'string' || !datos.fecha_pedido.trim()) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'La fecha_pedido debe ser una cadena válida (YYYY-MM-DD)'
                });
            }
            datosLimpios.fecha_pedido = datos.fecha_pedido.trim();
        }

        if (datos.canal !== undefined) {
            if (typeof datos.canal !== 'string' || !datos.canal.trim()) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El canal debe ser un texto válido'
                });
            }
            datosLimpios.canal = datos.canal.trim();
        }

        try {
            const pedidoActualizado = await PedidosModelo.actualizarPedido(req.params.id, datosLimpios);
            if (!pedidoActualizado) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Pedido no encontrado'
                });
            }

            return res.status(200).json({
                exito: true,
                mensaje: 'Pedido actualizado correctamente',
                datos: pedidoActualizado
            });
        } catch (error) {
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El cliente (id_cliente) o el empleado (id_empleado) indicado no existe'
                });
            }
            console.error('Error al actualizar pedido:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al actualizar el pedido'
            });
        }
    }

    static async eliminarPedido(req, res) {
        try {
            const eliminado = await PedidosModelo.eliminarPedido(req.params.id);
            if (!eliminado) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Pedido no encontrado'
                });
            }

            return res.status(200).json({
                exito: true,
                mensaje: 'Pedido eliminado correctamente'
            });
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({
                    exito: false,
                    mensaje: 'No se puede eliminar el pedido porque tiene detalles asociados'
                });
            }
            console.error('Error al eliminar pedido:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al eliminar el pedido'
            });
        }
    }
}

module.exports = PedidosControlador;