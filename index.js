import express from 'express'

import dotenv from 'dotenv'
dotenv.config({ path: "../.env" });
import connectDB from './db/connectDB.js'
import authRoute from './routes/auth.routes.js'
import cookieParser from 'cookie-parser';

const app = express();

const PORT = process.env.PORT||5000

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))


app.use('/api/v1/auth',authRoute)

app.listen(PORT,()=>{
    console.log(`server is listning at ${PORT}`);
    connectDB();
})


