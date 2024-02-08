import express from 'express';
import dotenv from 'dotenv';
import DBconnect from './connection/DBconnect.js';
const app = express();

dotenv.config();


DBconnect();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});