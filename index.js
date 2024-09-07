import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv';
import errorMiddleware  from './middleware/errorMiddleware.js';
import  usersRoutes  from './routes/usersRoutes.js';


dotenv.config()
const app = express();



app.use(cors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE'
}))
app.use(express.json());


//  endpoints auth
app.use('/api/users', usersRoutes)


app.use(errorMiddleware)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

