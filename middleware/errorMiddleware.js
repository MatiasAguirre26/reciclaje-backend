import { verifyToken } from "../utils/tokenManagement.js";
import HTTP_STATUS from "../helpers/httpStatus.js";

const userMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: "Token no proporcionado" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: "Token inválido" });
  }

  req.user = decoded;
  next();
};

export default userMiddleware;
