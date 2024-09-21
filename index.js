import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv';
import errorMiddleware  from './middleware/errorMiddleware.js';
import  authRoutes  from './routes/authRoutes.js';
import couponRoutes  from './routes/couponRoutes.js';
import rewardRoutes from './routes/rewardRoutes.js';
import userMiddleware from './middleware/authMiddleware.js';

dotenv.config()
const app = express();


app.use(cors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE'
}))
app.use(express.json());

// endpoints auth
app.use('/api/auth', authRoutes)

// endpoints coupon
app.use('/api/coupons', couponRoutes)

// endpoints reward
app.use('/api/rewards', rewardRoutes)

// Ruta de prueba para autenticación
app.get('/api/test', userMiddleware, (req, res) => {
    res.json({ message: 'Usuario autenticado', user: req.user });
  });
  

app.use(errorMiddleware)

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

