import { PrismaClient } from "@prisma/client";
import HTTP_STATUS from "../helpers/httpStatus.js";

const prisma = new PrismaClient();

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        points: true, // solo selecciona los puntos del usuario
      },
    });
    if (!user) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "User not found" });
    }

    res.status(HTTP_STATUS.OK).json(user.points);
  } catch (error) {
    console.log("error al obtener los puntos del usuario: ", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "error en el servidor" });
  }
};

export const updateUserPoints = async (req, res) => {
  try {
    const { id } = req.params;
    const { points } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        points: points,
      },
      select: {
        points: true,
      },
    });

    res.status(HTTP_STATUS.OK).json(updatedUser.points);
  } catch (error) {
    console.error("Error al actualizar los puntos del usuario: ", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error en el servidor al actualizar los puntos" });
  }
};
