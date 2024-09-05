import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv';
import errorMiddleware  from './middleware/errorMiddleware.js';
import  authRoutes  from './routes/usersRoutes.js';


dotenv.config()
const app = express();



//midlewares globales 
app.use(cors());
app.use(express.json());


//  rutas 
app.use('api/login' , authRoutes)


app.use(errorMiddleware)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

