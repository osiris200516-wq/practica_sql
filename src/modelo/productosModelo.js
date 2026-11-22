const pool = require('../config/bd');

class ProductosModelo 
{
    static async obtenerTodos ()
    {
        const [rows] = await pool.query ('SELECT * FROM productos');
        return rows;
    }

    static async obtenerPorId(id) 
    {
        const [rows] = await pool.query('SELECT * FROM productos WHERE id_producto = ?', [id]);
        return rows[0] || null;
    }

    static async crearProducto ({nombre, id_categoria, precio, costo, stock})
    {
        const [result] = await pool.query ('INSERT INTO productos (nombre, id_categoria, precio, costo, stock) VALUES (?, ?, ?, ?, ?)', [nombre, id_categoria, precio, costo, stock]);
        return {
            id_producto: result.insertID,
            nombre,
            id_categoria,
            precio,
            costo,
            stock
        };
    }

    static async actualizarProducto(id, datos) 
    {
        const productoActual = await this.obtenerPorId (id);
        if (!productoActual) return null;

const nombre = datos.nombre !== undefined ? datos.nombre : productoActual.nombre;
        const id_categoria = datos.id_categoria !== undefined ? datos.id_categoria : productoActual.id_categoria;
        const precio = datos.precio !== undefined ? datos.precio : productoActual.precio;
        const costo = datos.costo !== undefined ? datos.costo : productoActual.costo;
        const stock = datos.stock !== undefined ? datos.stock : productoActual.stock;

        await pool.query ('UPDATE productos SET nombre = ?, id_categoria = ?, precio = ?, costo = ?, stock = ? WHERE id_producto = ?', [nombre, id_categoria, precio, costo, stock, id])
        return {
            id_producto: Number (id),
            nombre,
            id_categoria,
            precio,
            costo,
            stock
        };
    }

    static async eliminarProducto (id)
    {
        const [result] = await pool.query ('DELETE FROM productos WHERE id_producto = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports =ProductosModelo;