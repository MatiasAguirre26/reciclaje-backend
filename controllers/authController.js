import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/tokenManagement.js";
import HTTP_STATUS from "../helpers/httpStatus.js";

const prisma = new PrismaClient();
// Registro de usuario
export const register = async (req, res) => {
  const { name, username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: "Las contraseñas no coinciden" });
  }

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Se registrado exitosamente" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role: "user",
      },
    });

    return res
      .status(HTTP_STATUS.CREATED)
      .json({ message: "Usuario registrado exitosamente", user: newUser });
  } catch (error) {
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error al registrar usuario", error });
  }
};

// Login de usuario
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Credenciales incorrectas" });
    }

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Credenciales incorrectas" });
    }

    const token = generateToken(user);

    return res
      .status(HTTP_STATUS.OK)
      .json({ message: "tokens generado", token });
  } catch (error) {
    console.log("error en el login", error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error al iniciar sesión", error: error.message });
  }
};