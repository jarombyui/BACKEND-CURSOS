import pool from '../config/db.js';

export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const [courses] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
        
        if (courses.length === 0) {
            return res.status(404).json({ message: 'Curso no encontrado' });
        }

        res.json(courses[0]);

    } catch (error) {
        console.error('Error al obtener curso por ID:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}; 