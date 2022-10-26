import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
const morgan = require('morgan');

import { dbConnect } from './db/db';
import authRoutes from './routes/authRoutes';
import pricePanRoutes from './routes/pricingPlansRoutes';
import { notFoundPage } from './middlewares/notFoundPage';


dotenv.config();

dbConnect();


const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.use(cors({
    origin: [process.env.CLIENT_URL]
}));


app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'server is up and running'
    });
});


app.use('/api/v1', authRoutes);
app.use('/api/v1', pricePanRoutes);

app.use('*', notFoundPage);


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`server running on PORT ${process.env.PORT}`);
});