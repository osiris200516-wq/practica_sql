const EmpleadosModelo = require('../modelo/empleadosModelo');

class EmpleadosControlador {
    static async obtenerEmpleados(req, res) {
        try {
            if (req.query.id_empleado !== undefined) {
                return EmpleadosControlador.responderEmpleadoPorId(req.query.id_empleado, res);
            }

            const empleados = await EmpleadosModelo.obtenerTodos();
            return res.status(200).json({
                exito: true,
                mensaje: 'Empleados obtenidos correctamente',
                datos: empleados
            });
        } catch (error) {
            return res.status(500).json({ exito: false, mensaje: 'Error al obtener los empleados' });
        }
    }

    static async obtenerEmpleadoPorId(req, res) {
        return EmpleadosControlador.responderEmpleadoPorId(req.params.id, res);
    }

    static async responderEmpleadoPorId(id, res) {
        try {
            const empleado = await EmpleadosModelo.obtenerPorId(id);

            if (!empleado) {
                return res.status(404).json({ exito: false, mensaje: 'Empleado no encontrado' });
            }

            return res.status(200).json({
                exito: true,
                mensaje: 'Empleado obtenido correctamente',
                datos: empleado
            });
        } catch (error) {
            return res.status(500).json({ exito: false, mensaje: 'Error al obtener el empleado' });
        }
    }

    static async crearEmpleado(req, res) {
        const { nombre, area } = req.body || {};
        if (typeof nombre !== 'string' || !nombre.trim() ||
            typeof area !== 'string' || !area.trim()) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Nombre y área son obligatorios y con texto'
            });
        }

        try {
            const empleado = await EmpleadosModelo.crearEmpleado(nombre.trim(), area.trim());
            return res.status(201).json({
                exito: true,
                mensaje: 'Empleado creado',
                datos: empleado
            });
        } catch (error) {
            console.error('Error real:', error);
            return res.status(500).json({ exito: false, mensaje: 'Error al crear el empleado' });
        }
    }

    static async actualizarEmpleado(req, res) {
        const datos = req.body || {};
        const datosLimpios = {};

        if (typeof datos.nombre === 'string' && datos.nombre.trim()) {
            datosLimpios.nombre = datos.nombre.trim();
        }
        if (typeof datos.area === 'string' && datos.area.trim()) {
            datosLimpios.area = datos.area.trim();
        }

        try {
            const empleadoActualizado = await EmpleadosModelo.actualizarEmpleado(req.params.id, datosLimpios);
            if (!empleadoActualizado) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Empleado no encontrado'
                });
            }

            return res.status(200).json({
                exito: true,
                mensaje: 'Empleado actualizado',
                datos: empleadoActualizado
            });
        } catch (error) {
            console.error('Error al actualizar empleado:', error);
            return res.status(500).json({ exito: false, mensaje: 'Error al actualizar el empleado' });
        }
    }

    static async eliminarEmpleado(req, res) {
        try {
            const eliminado = await EmpleadosModelo.eliminarEmpleado(req.params.id);
            if (!eliminado) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Empleado no encontrado'
                });
            }

            return res.status(200).json({
                exito: true,
                mensaje: 'Empleado eliminado'
            });
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({
                    exito: false,
                    mensaje: 'No se puede eliminar el empleado porque tiene pedidos asociados'
                });
            }
            console.error('Error al eliminar empleado:', error);
            return res.status(500).json({ exito: false, mensaje: 'Error al eliminar el empleado' });
        }
    }
}

module.exports = EmpleadosControlador;