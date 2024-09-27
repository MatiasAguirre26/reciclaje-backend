import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  // Convertir BigInt a string
  const userId = user.id.toString();
  return jwt.sign({ id: userId, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
