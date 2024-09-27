import { PrismaClient } from "@prisma/client";
import HTTP_STATUS from "../helpers/httpStatus.js";

const prisma = new PrismaClient();

// obtener cupones 
export const getCoupons = async (req, res) => {
  const userId = parseInt(req.user.id, 10); //  autenticación del usuario
  try {
    // Obtener cupones disponibles y los puntos del usuario
    const coupons = await prisma.coupon.findMany({
      where: {
        userId: null, //aun no canjeados
        expirationDate: {
          gte: new Date(), //  cupones no expirados
        },
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Usuario no encontrado" });
    }

    return res.status(HTTP_STATUS.OK).json({
      availablePoints: user.points,
      coupons,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error al obtener cupones" });
  }
};

// canjear cupones
export const redeemCoupon = async (req, res) => {
  console.log(req.user);
  console.log("solicitud recibida para el canje de cupon ", req.body);

  const { couponCode } = req.body;
  const userId = parseInt(req.user.id, 10); // si ya esta la  autenticación configurada

  try {
    // Buscar el cupón
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode },
    });

    console.log("cupon encontrado", coupon);

    if (!coupon || new Date(coupon.expirationDate) < new Date()) {
      console.log("cupon no valido o expirado");
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Cupón no válido o expirado" });
    }

    // Obtener el usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    console.log("usuario encontrado", user);

    if (!user) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Usuario no encontrado" });
    }

    if (user.points < coupon.discountValue) {
      console.log("puntos insuficientes");
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Puntos insuficientes" });
    }

    // Transacción para restar puntos y canjear el cupón
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { points: user.points - coupon.discountValue },
      }),
      prisma.coupon.update({
        where: { id: coupon.id },
        data: { userId: userId },
      }),
    ]);
    console.log("canje de puntos exitoso");
    return res
      .status(HTTP_STATUS.OK)
      .json({ message: "Cupón canjeado con éxito" });
  } catch (error) {
    console.error(error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error al canjear cupón" });
  }
};
