import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

async function createTestUser() {
    try {
        const nombre = 'Usuario Prueba';
        const email = 'test@example.com';
        const password = 'password123';
        const rol = 'usuario';

        // Generar hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertar usuario
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE id=id',
            [nombre, email, hashedPassword, rol]
        );

        console.log('Usuario de prueba creado exitosamente');
        console.log('Email:', email);
        console.log('Contraseña:', password);
        process.exit(0);
    } catch (error) {
        console.error('Error al crear usuario de prueba:', error);
        process.exit(1);
    }
}

createTestUser(); 