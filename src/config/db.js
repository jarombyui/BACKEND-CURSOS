import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Añade un pequeño test para verificar la conexión al iniciar
pool.getConnection()
  .then(connection => {
    console.log('Conectado a la base de datos MySQL con pool. ID del hilo:', connection.threadId);
    connection.release(); // Libera la conexión de vuelta al pool
  })
  .catch(err => {
    console.error('Error al conectar al pool de la base de datos:', err.message);
  });

export default pool;