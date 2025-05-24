import { findUserByEmail, createUser } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Contraseña incorrecta' });
  const token = jwt.sign({ id: user.id, email: user.email, nombre: user.nombre }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email } });
};

export const register = async (req, res) => {
  const { nombre, email, password } = req.body;
  const exists = await findUserByEmail(email);
  if (exists) return res.status(400).json({ message: 'El email ya está registrado' });
  const hash = await bcrypt.hash(password, 10);
  const user = await createUser({ nombre, email, password: hash });
  const token = jwt.sign({ id: user.id, email: user.email, nombre: user.nombre }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.status(201).json({ token, user: { id: user.id, nombre: user.nombre, email: user.email } });
}; 