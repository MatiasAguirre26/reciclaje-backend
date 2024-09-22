import { PrismaClient } from '@prisma/client';
import HTTP_STATUS from '../helpers/httpStatus.js';

const prisma = new PrismaClient();


// Obtener todas las recompensas
export const getRewards = async (req, res) => {
    try {
        const rewards = await prisma.benefits.findMany({
            include: {
                coupons: true
            }
        });
        res.status(HTTP_STATUS.OK).json(rewards);
    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Error al obtener las recompensas' });
    }
};

// Obtener detalle de una recompensa
export const getRewardDetail = async (req, res) => {
    const { id } = req.params;

    try {
        const rewardDetail = await prisma.benefits.findUnique({
            where: {
                id: BigInt(id),
            },
            include: {
                coupons: true
            }
        });

        if (!rewardDetail) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Recompensa no encontrada' });
        }

        res.status(HTTP_STATUS.OK).json(rewardDetail);
    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Error al obtener el detalle de la recompensa' });
    }
};

// Generar QR con la información del cliente y los beneficios canjeados
export const generateRewardQR = async (req, res) => {
    const { userId, benefitId } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { id: BigInt(userId) },
            include: {
                coupons: true,
            },
        });

        const benefit = await prisma.benefits.findUnique({
            where: { id: BigInt(benefitId) },
        });

        if (!user || !benefit) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Usuario o beneficio no encontrado' });
        }

        // Generar el QR code con los datos del usuario y beneficio (placeholder de la lógica)
        const qrData = {
            user: {
                name: user.name,
                points: user.points,
            },
            benefit: {
                discount: benefit.discountPercentage,
                locations: benefit.locals,
            },
        };

        // Puedes usar una librería como `qrcode` para generar un QR con qrData
        res.status(HTTP_STATUS.CREATED).json({ message: 'QR generado con éxito', qrData });
    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Error al generar el QR' });
    }
};
