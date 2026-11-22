const pool = require('../config/bd');

class PedidosModelo {
    static async obtenerTodos() {
        const [rows] = await pool.query('SELECT * FROM pedidos');
        return rows;
    }

    static async obtenerPorId(id) {
        const [rows] = await pool.query('SELECT * FROM pedidos WHERE id_pedido = ?', [id]);
        return rows[0];
    }

    static async obtenerConCliente() {
        const [rows] = await pool.query(`
            SELECT 
                p.id_pedido,
                p.id_cliente,
                c.nombre AS cliente,
                p.id_empleado,
                p.fecha_pedido,
                p.canal
            FROM pedidos p
            INNER JOIN clientes c ON p.id_cliente = c.id_cliente
        `);
        return rows;
    }

    static async crearPedido({ id_cliente, id_empleado, fecha_pedido, canal }) {
        const fecha = fecha_pedido || new Date().toISOString().split('T')[0];
        const [result] = await pool.query(
            'INSERT INTO pedidos (id_cliente, id_empleado, fecha_pedido, canal) VALUES (?, ?, ?, ?)',
            [id_cliente, id_empleado, fecha, canal]
        );
        return {
            id_pedido: result.insertId,
            id_cliente,
            id_empleado,
            fecha_pedido: fecha,
            canal
        };
    }


    static async actualizarPedido(id, datos) {
        const pedidoActual = await this.obtenerPorId(id);
        if (!pedidoActual) return null;

        const id_cliente = datos.id_cliente !== undefined ? datos.id_cliente : pedidoActual.id_cliente;
        const id_empleado = datos.id_empleado !== undefined ? datos.id_empleado : pedidoActual.id_empleado;
        const fecha_pedido = datos.fecha_pedido !== undefined ? datos.fecha_pedido : pedidoActual.fecha_pedido;
        const canal = datos.canal !== undefined ? datos.canal : pedidoActual.canal;

        await pool.query(
            'UPDATE pedidos SET id_cliente = ?, id_empleado = ?, fecha_pedido = ?, canal = ? WHERE id_pedido = ?',
            [id_cliente, id_empleado, fecha_pedido, canal, id]
        );

        return {
            id_pedido: Number(id),
            id_cliente,
            id_empleado,
            fecha_pedido,
            canal
        };
    }

    static async eliminarPedido(id) {
        const [result] = await pool.query('DELETE FROM pedidos WHERE id_pedido = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = PedidosModelo;