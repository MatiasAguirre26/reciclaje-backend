import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv';
import errorMiddleware  from './middleware/errorMiddleware.js';
import  authRoutes  from './routes/authRoutes.js';
import recyclingRoutes from './routes/recyclingRoutes.js';
import { confirmRecycling } from './controllers/recyclingController.js';
import couponRoutes  from './routes/couponRoutes.js';
import rewardRoutes from './routes/rewardRoutes.js';
import userMiddleware from './middleware/authMiddleware.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config()
const app = express();

app.use(cors())


app.use(cors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE'
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//endpoint de reciclaje confirmacion 
app.use('/api', recyclingRoutes)

// endpoints auth
app.use('/api/auth', authRoutes)

// endpoints coupon 
app.use('/api/coupons', couponRoutes)

// endpoints reward
app.use('/api/rewards', rewardRoutes)

// endpoints users
app.use('/api/users', userRoutes)




app.use(errorMiddleware)

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

