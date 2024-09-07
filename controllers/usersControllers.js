import bcrypt from 'bcrypt';
import HTTP_STATUS from '../helpers/httpStatus.js';
import { generateToken } from '../utils/tokenManagement.js';

// (solo para ejemplo)
const users = [];

// controlador para inicio de session 
export const login = (req, res) => {
  const { email, password } = req.body;

  const user = users.find((user) => user.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Credenciales incorrectas' });
  }

  const token = generateToken(user.id);
  res.status(HTTP_STATUS.OK).json({ token });
};

// controlador para registro de usuarios 
export const register = (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'El correo ya está en uso' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: users.length + 1,
    username,
    email,
    password: hashedPassword,
  };
  
  users.push(newUser);

  res.status(HTTP_STATUS.CREATED).json({ message: 'Registro exitoso' });
};


// ---------