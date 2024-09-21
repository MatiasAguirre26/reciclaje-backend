import { PrismaClient } from '@prisma/client';
import HTTP_STATUS from '../helpers/httpStatus.js';

const prisma = new PrismaClient();

// Obtener todas las recompensas disponibles
export const getRewards = async (req, res) => {
  try {
    const rewards = await prisma.benefits.findMany();
    return res.status(HTTP_STATUS.OK).json(rewards);
  } catch (error) {
    console.error('Error al obtener recompensas', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener recompensas' });
  }
};

// Canjear una recompensa
export const redeemReward = async (req, res) => {
  const userId = req.user.id;
  const { benefitId } = req.body; // ID de la recompensa a canjear

  try {
    // Buscar la recompensa
    const benefit = await prisma.benefits.findUnique({
      where: { id: benefitId },
    });

    if (!benefit) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Recompensa no encontrada' });
    }

    // Obtener al usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Usuario no encontrado' });
    }

    if (user.points < benefit.discountPercentage) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Puntos insuficientes para canjear esta recompensa' });
    }

    // Transacción para restar puntos y asignar la recompensa al usuario
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { points: user.points - benefit.discountPercentage },
      }),
      prisma.coupon.create({
        data: {
          userId: userId,
          benefitsId: benefit.id,
          code: `REWARD-${Date.now()}`, // Genera un código único
          discountValue: benefit.discountPercentage,
          expirationDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // 1 mes de validez
        },
      }),
    ]);

    return res.status(HTTP_STATUS.OK).json({ message: 'Recompensa canjeada con éxito' });
  } catch (error) {
    console.error('Error al canjear recompensa', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error al canjear recompensa' });
  }
};
