const EmpleadosModelo = require('../modelo/empleadosModelo');

class EmpleadosControlador 
{
    static async obtenerEmpleados(req, res) 
    {
        try
        {
            if (req.query.id_empleado !== undefined) {
                return EmpleadosControlador.responderEmpleadoPorId(req.query.id_empleado, res);
            }

            const empleados = await EmpleadosModelo.obtenerTodos();
            return res.status(200).json({ exito: true, data: empleados });
        }
        catch (error)
        {
            return res.status(500).json({ exito: false, mensaje: 'Error al obtener los empleados' });
        }
    }

    static async obtenerEmpleadoPorId(req, res)
    {
        return EmpleadosControlador.responderEmpleadoPorId(req.params.id, res);
    }

    static async responderEmpleadoPorId(id, res)
    {
        try
        {
            const empleado = await EmpleadosModelo.obtenerPorId(id);

            if (!empleado) {
                return res.status(404).json({ exito: false, mensaje: 'Empleado no encontrado' });
            }

            return res.status(200).json({ exito: true, data: empleado });
        }
        catch (error)
        {
            return res.status(500).json({ exito: false, mensaje: 'Error al obtener el empleado' });
        }
    }

    static async crearEmpleado(req, res)
    {
        const { nombre, area } = req.body || {};
        if (typeof nombre !== 'string' || !nombre.trim() ||
            typeof area !== 'string' || !area.trim()) {
            return res.status(400).json({
                exito: false,
                mensaje: 'nombre y area son obligatorios'
            });
        }

        try
        {
            const empleado = await EmpleadosModelo.crearEmpleado(nombre.trim(), area.trim());
            return res.status(201).json({ exito: true, datos: empleado });

        }
        catch (error)
        {
            console.error('Error real:', error);
            return res.status(500).json({ exito: false, mensaje: 'Error al crear el empleado' });
        }
    }
}
module.exports = EmpleadosControlador;