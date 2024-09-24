import { PrismaClient } from "@prisma/client";
import HTTP_STATUS from "../helpers/httpStatus.js";

const prisma = new PrismaClient();

export const searchUser = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, points: true }
    });

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Usuario no encontrado" });
    }

    return res.status(HTTP_STATUS.OK).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error al buscar usuario" });
  }
};

export const addPoints = async (req, res) => {
  const { userId, points, weights } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Usuario no encontrado" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: { points: { increment: points } }
    });

    const validWeights = Object.entries(weights).filter(([_, weight]) => !isNaN(parseFloat(weight)) && parseFloat(weight) > 0);

    const transaction = await prisma.transaction.create({
      data: {
        userId: Number(userId),
        adminId: Number(req.user.id),
        totalPoints: points,
        state: true,
        details: {
          create: validWeights.map(([material, weight]) => ({
            materialId: getMaterialId(material),
            weight: parseFloat(weight),
            points: Math.ceil(parseFloat(weight) * getPointsPerKg(material))
          }))
        }
      }
    });

    return res.status(HTTP_STATUS.OK).json({
      message: "Puntos agregados exitosamente",
      user: { id: updatedUser.id, email: updatedUser.email, points: updatedUser.points },
      transaction: { id: transaction.id, totalPoints: transaction.totalPoints }
    });
  } catch (error) {
    console.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error al agregar puntos" });
  }
};

function getMaterialId(material) {
  const materialIds = {
    cardboard: 1,
    glass: 2,
    paper: 3,
    metal: 4,
    plastic: 5
  };
  return materialIds[material];
}

function getPointsPerKg(material) {
  const pointsPerKg = {
    cardboard: 10,
    glass: 5,
    paper: 8,
    metal: 15,
    plastic: 12
  };
  return pointsPerKg[material];
}