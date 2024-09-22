import { PrismaClient } from '@prisma/client';
import HTTP_STATUS from '../helpers/httpStatus.js';

const prisma = new PrismaClient();

export const confirmRecycling = async (req, res) => {
    console.log(req.body);
  const { materials, location } = req.body;
  const userId = req?.userId;

  try {
    const transaction = await prisma.transaction.create({
      data: {
        userId: userId,
        recyclingPointId: location.id,
        totalPoints: 0,
        state: false,
        details: {
          create: materials.map(material => ({
            materialId: material.id,
          }))
        }
      },
    });

    res.status(HTTP_STATUS.CREATED).json({ message: 'Reciclaje confirmado', transactionId: transaction.id });
  } catch (error) {
    console.error('Error al confirmar reciclaje:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error al procesar la solicitud' });
  }
};
