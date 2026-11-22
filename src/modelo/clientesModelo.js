const pool = require('../config/bd');

class UsuarioModelo {
    static async obtenerUsuarios() {
        const [rows] = await pool.query('SELECT * FROM clientes');
        return rows;
    }

    static async obtenerUsuarioPorId(id) {
        const [rows] = await pool.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
        return rows[0];
    }

    static async crear({ nombre, ciudad, fecha_registro }) {
        const fecha = fecha_registro || new Date().toISOString().split('T')[0];
        const [result] = await pool.query(
            'INSERT INTO clientes (nombre, ciudad, fecha_registro) VALUES (?, ?, ?)',
            [nombre, ciudad, fecha]
        );
        return {
            id_cliente: result.insertId,
            nombre,
            ciudad,
            fecha_registro: fecha
        };
    }

    static async actualizar(id, datos) {
        const clienteActual = await this.obtenerUsuarioPorId(id);
        if (!clienteActual) return null;

        const nombre = datos.nombre || clienteActual.nombre;
        const ciudad = datos.ciudad || clienteActual.ciudad;
        const fecha_registro = datos.fecha_registro || clienteActual.fecha_registro;

        await pool.query(
            'UPDATE clientes SET nombre = ?, ciudad = ?, fecha_registro = ? WHERE id_cliente = ?',
            [nombre, ciudad, fecha_registro, id]
        );

        return {
            id_cliente: Number(id),
            nombre,
            ciudad,
            fecha_registro
        };
    }

    static async eliminar(id) {
        const [result] = await pool.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);
        return result.affectedRows > 0;
    }

    
}

module.exports = UsuarioModelo;