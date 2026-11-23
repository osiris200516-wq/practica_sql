const pool = require('../config/bd');

class CategoriasModelo {
    static async obtenerTodas() {
        const [rows] = await pool.query('SELECT * FROM categorias');
        return rows;

    }
    static async obtenerPorId(id) {
        const [rows] = await pool.query('SELECT * FROM categorias WHERE id_categoria = ?', [id]);
        return rows[0];
    }

    
    static async crearCategoria(nombre) {
        const [result] = await pool.query(
            'INSERT INTO categorias (nombre) VALUES (?)',
            [nombre]
        );
        return { id_categoria: result.insertId, nombre };
    }

    static async actualizarCategoria(id, datos) {
        const categoriaActual = await this.obtenerPorId(id);
        if (!categoriaActual) return null;

        const nombre = datos.nombre || categoriaActual.nombre;

        await pool.query(
            'UPDATE categorias SET nombre = ? WHERE id_categoria = ?',
            [nombre, id]
        );

        return { id_categoria: Number(id), nombre };
    }

    // Elimina una categoría por su ID
    static async eliminarCategoria(id) {
        const [result] = await pool.query('DELETE FROM categorias WHERE id_categoria = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = CategoriasModelo;