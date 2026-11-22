const pool = require('../config/bd');

class EmpleadosModelo {

    static async obtenerTodos() {
        const [rows] = await pool.query('SELECT * FROM empleados');
        return rows;
    }

    static async obtenerPorId(id) {
        const [rows] = await pool.query('SELECT * FROM empleados WHERE id_empleado = ?', [id]);
        return rows[0];
    }

    static async crearEmpleado(nombre, area) {
        const [result] = await pool.query(
            'INSERT INTO empleados (nombre, area) VALUES (?, ?)',
            [nombre, area]
        );
        return { id_empleado: result.insertId, nombre, area };
    }

    static async actualizarEmpleado(id, datos) {
        const empleadoActual = await this.obtenerPorId(id);
        if (!empleadoActual) return null;

        const nombre = datos.nombre || empleadoActual.nombre;
        const area = datos.area || empleadoActual.area;

        await pool.query(
            'UPDATE empleados SET nombre = ?, area = ? WHERE id_empleado = ?',
            [nombre, area, id]
        );

        return { id_empleado: Number(id), nombre, area };
    }

    static async eliminarEmpleado(id) {
        const [result] = await pool.query('DELETE FROM empleados WHERE id_empleado = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = EmpleadosModelo;