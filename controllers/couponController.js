import { PrismaClient } from '@prisma/client';
import HTTP_STATUS from '../helpers/httpStatus.js';

const prisma = new PrismaClient();

export const getCoupons = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        coupons: true,
      },
    });

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Usuario no encontrado' });
    }

    const availableCoupons = await prisma.coupon.findMany({
      where: {
        expirationDate: {
          gte: new Date(),
        },
        userId: null,
      },
      include: {
        benefits: true,
      },
    });

    return res.status(HTTP_STATUS.OK).json({
      availablePoints: user.points,
      redeemedCoupons: user.coupons,
      availableCoupons,
    });
  } catch (error) {
    console.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener cupones' });
  }
};

export const redeemCoupon = async (req, res) => {
  const { couponId, cost } = req.body;
  const userId = req.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Usuario no encontrado' });
    }

    if (user.points < cost) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Puntos insuficientes' });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { id: couponId },
      include: {
        benefits: true,
      },
    });

    if (!coupon || coupon.userId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Cupón no disponible' });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { points: user.points - cost },
      }),
      prisma.coupon.update({
        where: { id: couponId },
        data: { userId: userId },
      }),
    ]);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Cupón canjeado con éxito',
      updatedPoints: user.points - cost,
      redeemedCoupon: {
        ...coupon,
        discount: coupon.benefits ? `${coupon.benefits.discountPercentage}%` : `$${coupon.discountValue}`,
        category: coupon.benefits ? coupon.benefits.locals : 'Descuento general',
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error al canjear cupón' });
  }
};
