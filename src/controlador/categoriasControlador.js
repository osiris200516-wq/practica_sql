const CategoriasModelo = require('../modelo/categoriasModelo');

class CategoriasControlador {
    static async obtenerCategorias(req, res) {
        try {
            if (req.query.id_categoria !== undefined) {
                return CategoriasControlador.responderCategoriaPorId(req.query.id_categoria, res);
            }

            const categorias = await CategoriasModelo.obtenerTodas();
            return res.status(200).json({
                exito: true,
                mensaje: 'Categorías obtenidas correctamente',
                datos: categorias
            });
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al obtener las categorías'
            });
        }
    }

    static async obtenerCategoriaPorId(req, res) {
        return CategoriasControlador.responderCategoriaPorId(req.params.id, res);
    }

    static async responderCategoriaPorId(id, res) {
        try {
            const categoria = await CategoriasModelo.obtenerPorId(id);

            if (!categoria) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Categoría no encontrada'
                });
            }

            return res.status(200).json({
                exito: true,
                mensaje: 'Categoría obtenida correctamente',
                datos: categoria
            });
        } catch (error) {
            console.error('Error al obtener categoría por ID:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al obtener la categoría'
            });
        }
    }

    static async crearCategoria(req, res) {
        const { nombre } = req.body || {};

        if (typeof nombre !== 'string' || !nombre.trim()) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El nombre de la categoría es obligatorio y debe ser texto'
            });
        }

        try {
            const categoria = await CategoriasModelo.crearCategoria(nombre.trim());
            return res.status(201).json({
                exito: true,
                mensaje: 'Categoría creada correctamente',
                datos: categoria
            });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    exito: false,
                    mensaje: 'Ya existe una categoría registrada con ese nombre'
                });
            }
            console.error('Error al crear categoría:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al crear la categoría'
            });
        }
    }

    static async actualizarCategoria(req, res) {
        const datos = req.body || {};
        const datosLimpios = {};

        if (datos.nombre !== undefined) {
            if (typeof datos.nombre !== 'string' || !datos.nombre.trim()) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El nombre de la categoría debe ser un texto válido'
                });
            }
            datosLimpios.nombre = datos.nombre.trim();
        }

        try {
            const categoriaActualizada = await CategoriasModelo.actualizarCategoria(req.params.id, datosLimpios);
            if (!categoriaActualizada) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Categoría no encontrada'
                });
            }

            return res.status(200).json({
                exito: true,
                mensaje: 'Categoría actualizada correctamente',
                datos: categoriaActualizada
            });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    exito: false,
                    mensaje: 'Ya existe otra categoría con ese nombre'
                });
            }
            console.error('Error al actualizar categoría:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al actualizar la categoría'
            });
        }
    }

    static async eliminarCategoria(req, res) {
        try {
            const eliminado = await CategoriasModelo.eliminarCategoria(req.params.id);
            if (!eliminado) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Categoría no encontrada'
                });
            }

            return res.status(200).json({
                exito: true,
                mensaje: 'Categoría eliminada correctamente'
            });
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({
                    exito: false,
                    mensaje: 'No se puede eliminar la categoría porque tiene productos asociados'
                });
            }
            console.error('Error al eliminar categoría:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al eliminar la categoría'
            });
        }
    }
}

module.exports = CategoriasControlador;