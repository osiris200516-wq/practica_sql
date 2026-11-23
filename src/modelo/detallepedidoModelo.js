const pool = require('../config/bd');

class DetallePedidoModelo {
    static async obtenerTodos() {
        const [rows] = await pool.query('SELECT * FROM detalle_pedido');
        return rows;
    }
    static async obtenerPorId(id) {
        const [rows] = await pool.query('SELECT * FROM detalle_pedido WHERE id_detalle = ?', [id]);
        return rows[0];
    }
    static async obtenerDetallePorPedido(id_pedido) {
        const [rows] = await pool.query(`
            SELECT 
                dp.id_detalle,
                dp.id_pedido,
                p.fecha_pedido,
                p.canal,
                dp.id_producto,
                pr.nombre AS producto,
                dp.cantidad,
                dp.precio_unitario,
                (dp.cantidad * dp.precio_unitario) AS subtotal
            FROM detalle_pedido dp
            INNER JOIN productos pr ON dp.id_producto = pr.id_producto
            INNER JOIN pedidos p ON dp.id_pedido = p.id_pedido
            WHERE dp.id_pedido = ?
        `, [id_pedido]);
        return rows;
    }
    static async obtenerResumenPorProducto() {
        const [rows] = await pool.query(`
            SELECT 
                pr.id_producto,
                pr.nombre AS producto,
                SUM(dp.cantidad) AS total_unidades_vendidas,
                SUM(dp.cantidad * dp.precio_unitario) AS total_vendido
            FROM detalle_pedido dp
            INNER JOIN productos pr ON dp.id_producto = pr.id_producto
            GROUP BY pr.id_producto, pr.nombre
            ORDER BY total_vendido DESC
        `);
        return rows;
    }
    static async crearDetalle({ id_pedido, id_producto, cantidad, precio_unitario }) {
        const [result] = await pool.query(
            'INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
            [id_pedido, id_producto, cantidad, precio_unitario]
        );
        return {
            id_detalle: result.insertId,
            id_pedido,
            id_producto,
            cantidad,
            precio_unitario
        };
    }

    // Actualiza un detalle existente manteniendo los valores previos no enviados
    static async actualizarDetalle(id, datos) {
        const detalleActual = await this.obtenerPorId(id);
        if (!detalleActual) return null;

        const id_pedido = datos.id_pedido !== undefined ? datos.id_pedido : detalleActual.id_pedido;
        const id_producto = datos.id_producto !== undefined ? datos.id_producto : detalleActual.id_producto;
        const cantidad = datos.cantidad !== undefined ? datos.cantidad : detalleActual.cantidad;
        const precio_unitario = datos.precio_unitario !== undefined ? datos.precio_unitario : detalleActual.precio_unitario;

        await pool.query(
            'UPDATE detalle_pedido SET id_pedido = ?, id_producto = ?, cantidad = ?, precio_unitario = ? WHERE id_detalle = ?',
            [id_pedido, id_producto, cantidad, precio_unitario, id]
        );

        return {
            id_detalle: Number(id),
            id_pedido,
            id_producto,
            cantidad,
            precio_unitario
        };
    }
    static async eliminarDetalle(id) {
        const [result] = await pool.query('DELETE FROM detalle_pedido WHERE id_detalle = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = DetallePedidoModelo;