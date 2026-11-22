const ProductosModelo = require('../modelo/productosModelo');

class ProductosControlador {
    static async obtenerProductos(req, res) {
        try {
            if (req.query.id_producto !== undefined) {
                return ProductosControlador.responderProductoPorId(req.query.id_producto, res);
            }

            const productos = await ProductosModelo.obtenerTodos();
            return res.status(200).json({
                exito: true,
                mensaje: 'Productos obtenidos correctamente',
                datos: productos
            });
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al obtener los productos'
            });
        }
    }

    static async obtenerProductoPorId(req, res) {
        return ProductosControlador.responderProductoPorId(req.params.id, res);
    }

    static async responderProductoPorId(id, res) {
        try {
            const producto = await ProductosModelo.obtenerPorId(id);

            if (!producto) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Producto no encontrado'
                });
            }

            return res.status(200).json({
                exito: true,
                mensaje: 'Producto obtenido correctamente',
                datos: producto
            });
        } catch (error) {
            console.error('Error al obtener producto por ID:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al obtener el producto'
            });
        }
    }

    static async obtenerProductosConCategoria(req, res) {
        try {
            const productos = await ProductosModelo.obtenerConCategoria();
            return res.status(200).json({
                exito: true,
                mensaje: 'Productos con categoría obtenidos correctamente',
                datos: productos
            });
        } catch (error) {
            console.error('Error al obtener productos con categoría:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al obtener los productos con su categoría'
            });
        }
    }

    static async crearProducto(req, res) {
        const { nombre, id_categoria, precio, costo, stock } = req.body || {};

        if (typeof nombre !== 'string' || !nombre.trim()) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El nombre del producto es obligatorio y debe ser texto'
            });
        }

        if (!Number.isInteger(Number(id_categoria)) || Number(id_categoria) <= 0) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El id_categoria es obligatorio y debe ser un número entero válido'
            });
        }

        if (precio === undefined || isNaN(Number(precio)) || Number(precio) < 0 ||
            costo === undefined || isNaN(Number(costo)) || Number(costo) < 0) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Precio y costo son obligatorios y deben ser valores numéricos mayores o iguales a 0'
            });
        }

        if (stock === undefined || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El stock es obligatorio y debe ser un número entero mayor o igual a 0'
            });
        }

        try {
            const producto = await ProductosModelo.crearProducto({
                nombre: nombre.trim(),
                id_categoria: Number(id_categoria),
                precio: Number(precio),
                costo: Number(costo),
                stock: Number(stock)
            });

            return res.status(201).json({
                exito: true,
                mensaje: 'Producto creado correctamente',
                datos: producto
            });
        } catch (error) {
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'La categoría indicada (id_categoria) no existe'
                });
            }
            console.error('Error al crear producto:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al crear el producto'
            });
        }
    }

    static async actualizarProducto(req, res) {
        const datos = req.body || {};
        const datosLimpios = {};

        if (datos.nombre !== undefined) {
            if (typeof datos.nombre !== 'string' || !datos.nombre.trim()) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El nombre debe ser un texto válido'
                });
            }
            datosLimpios.nombre = datos.nombre.trim();
        }

        if (datos.id_categoria !== undefined) {
            if (!Number.isInteger(Number(datos.id_categoria)) || Number(datos.id_categoria) <= 0) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El id_categoria debe ser un número entero válido'
                });
            }
            datosLimpios.id_categoria = Number(datos.id_categoria);
        }

        if (datos.precio !== undefined) {
            if (isNaN(Number(datos.precio)) || Number(datos.precio) < 0) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El precio debe ser un valor numérico mayor o igual a 0'
                });
            }
            datosLimpios.precio = Number(datos.precio);
        }

        if (datos.costo !== undefined) {
            if (isNaN(Number(datos.costo)) || Number(datos.costo) < 0) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El costo debe ser un valor numérico mayor o igual a 0'
                });
            }
            datosLimpios.costo = Number(datos.costo);
        }

        if (datos.stock !== undefined) {
            if (!Number.isInteger(Number(datos.stock)) || Number(datos.stock) < 0) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El stock debe ser un número entero mayor o igual a 0'
                });
            }
            datosLimpios.stock = Number(datos.stock);
        }

        try {
            const productoActualizado = await ProductosModelo.actualizarProducto(req.params.id, datosLimpios);
            if (!productoActualizado) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Producto no encontrado'
                });
            }

            return res.status(200).json({
                exito: true,
                mensaje: 'Producto actualizado correctamente',
                datos: productoActualizado
            });
        } catch (error) {
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'La categoría indicada (id_categoria) no existe'
                });
            }
            console.error('Error al actualizar producto:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al actualizar el producto'
            });
        }
    }

    static async eliminarProducto(req, res) {
        try {
            const eliminado = await ProductosModelo.eliminarProducto(req.params.id);
            if (!eliminado) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Producto no encontrado'
                });
            }

            return res.status(200).json({
                exito: true,
                mensaje: 'Producto eliminado correctamente'
            });
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({
                    exito: false,
                    mensaje: 'No se puede eliminar el producto porque tiene detalles de pedido asociados'
                });
            }
            console.error('Error al eliminar producto:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al eliminar el producto'
            });
        }
    }
}

module.exports = ProductosControlador;