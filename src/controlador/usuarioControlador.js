const UsuarioModelo = require('../modelo/usuarioModelo');

class UsuarioControlador {

    // Coordina el listado y devuelve un sobre de respuesta uniforme.
    static obtenerUsuarios(req, res) {
        return res.status(200).json({
            exito: true,
            mensaje: 'Usuarios obtenidos correctamente',
            datos: UsuarioModelo.obtenerUsuarios()
        });
    }

    // Busca el usuario indicado por URL y responde 404 si no existe.
    static obtenerUsuarioPorId(req, res) {
        const usuario = UsuarioModelo.obtenerUsuarioPorId(req.params.id);
        if (!usuario) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Usuario no encontrado'
            });
        }
        return res.status(200).json({
            exito: true,
            mensaje: 'Usuario obtenido correctamente',
            datos: usuario
        });
    }

    // Valida los campos mínimos antes de delegar la creación al modelo.
    static crear(req, res) {
        const { nombre, email } = req.body || {};
        if (typeof nombre !== 'string' || !nombre.trim() ||
            typeof email !== 'string' || !email.trim()) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Nombre y email son obligatorios y deben ser texto'
            });
        }

        const nuevoUsuario = UsuarioModelo.crear({
            nombre: nombre.trim(),
            email: email.trim()
        });

        return res.status(201).json({
            exito: true,
            mensaje: 'Usuario creado correctamente',
            datos: nuevoUsuario
        });
    }

    // Delega la actualización y distingue entre éxito y usuario inexistente.
    static actualizar(req, res) {
        const datos = req.body || {};
        const datosLimpios = {};

        if (typeof datos.nombre === 'string' && datos.nombre.trim()) {
            datosLimpios.nombre = datos.nombre.trim();
        }
        if (typeof datos.email === 'string' && datos.email.trim()) {
            datosLimpios.email = datos.email.trim();
        }

        const usuarioActualizado = UsuarioModelo.actualizar(req.params.id, datosLimpios);
        if (!usuarioActualizado) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Usuario no encontrado'
            });
        }

        return res.status(200).json({
            exito: true,
            mensaje: 'Usuario actualizado correctamente',
            datos: usuarioActualizado
        });
    }

    // Elimina el usuario solicitado y confirma el resultado de la operación.
    static eliminar(req, res) {
        const eliminado = UsuarioModelo.eliminar(req.params.id);
        if (!eliminado) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Usuario no encontrado'
            });
        }
        return res.status(200).json({
            exito: true,
            mensaje: 'Usuario eliminado correctamente'
        });
    }
}

module.exports = UsuarioControlador;