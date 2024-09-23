import { PrismaClient } from "@prisma/client";
import HTTP_STATUS from "../helpers/httpStatus.js";

const prisma = new PrismaClient();

export const getPendingTransactionsForUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: Int(userId),
        state: false,
      },
      include: {
        details: true,
      },
    });

    return res.status(HTTP_STATUS.OK).json({ transactions });
  } catch (error) {
    console.error("Error al obtener transacciones pendientes", error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({
        message: "Error al obtener transacciones pendientes",
        error: error.message,
      });
  }
};

export const confirmTransaction = async (req, res) => {
  const { transactionId } = req.params;
  const { materials } = req.body;

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: Int(transactionId) },
      include: {
        details: true,
        user: true,
      },
    });

    if (!transaction || transaction.state) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Transacción no encontrada o ya confirmada" });
    }

    let totalPoints = 0;

    for (const material of materials) {
      const { materialId, weight } = material;

      const materialInfo = await prisma.material.findUnique({
        where: { id: Int(materialId) },
      });

      if (!materialInfo) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: `Material con ID ${materialId} no encontrado` });
      }

      const points = Math.floor(materialInfo.pointsPerKg * weight);

      await prisma.transactionDetail.upsert({
        where: {
          transactionId_materialId: {
            transactionId: Int(transactionId),
            materialId: Int(materialId),
          },
        },
        update: {
          weight,
          points,
        },
        create: {
          transactionId: Int(transactionId),
          materialId: Int(materialId),
          weight,
          points,
        },
      });

      totalPoints += points;
    }

    await prisma.transaction.update({
      where: { id: Int(transactionId) },
      data: {
        totalPoints,
        state: true,
        adminId: Int(req.user.id),
      },
    });

    await prisma.user.update({
      where: { id: Int(transaction.userId) },
      data: {
        points: transaction.user.points + totalPoints,
      },
    });

    return res
      .status(HTTP_STATUS.OK)
      .json({ message: "Transacción confirmada exitosamente", totalPoints });
  } catch (error) {
    console.error("Error al confirmar transacción", error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({
        message: "Error al confirmar transacción",
        error: error.message,
      });
  }
};
