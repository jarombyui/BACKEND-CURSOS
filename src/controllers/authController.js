import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el usuario existe
        const [users] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const user = users[0];

        // Verificar la contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: user.id,
                email: user.email,
                rol: user.rol 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Enviar respuesta sin la contraseña
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const register = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Verificar si el email ya existe
        const [existingUsers] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertar nuevo usuario
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, hashedPassword]
        );

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: result.insertId,
                email,
                rol: 'usuario'
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}; 