import pool from '../config/db.js';

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  return rows[0];
};

export const createUser = async (user) => {
  const { nombre, email, password } = user;
  const [result] = await pool.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', [nombre, email, password]);
  return { id: result.insertId, ...user };
}; 