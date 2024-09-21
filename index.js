import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv';
import errorMiddleware  from './middleware/errorMiddleware.js';
import  authRoutes  from './routes/authRoutes.js';
import recyclingRoutes from './routes/recyclingRoutes.js';
import { confirmRecycling } from './controllers/recyclingController.js';


dotenv.config()
const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//endpoint de reciclaje confirmacion 
app.use('/api', recyclingRoutes)
//  endpoints auth
app.use('/api/auth', authRoutes)


app.use(errorMiddleware)

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

