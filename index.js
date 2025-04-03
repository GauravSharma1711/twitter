import express from 'express'

import dotenv from 'dotenv'
dotenv.config({ path: "../.env" });
import connectDB from './db/connectDB.js'
import cookieParser from 'cookie-parser';


import authRoute from './routes/auth.routes.js'
import   userRoute from './routes/user.routes.js'
import   postRoute from './routes/post.routes.js'
import   notificationRoute from './routes/notification.routes.js'


const app = express();

const PORT = process.env.PORT||5000

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))


app.use('/api/v1/auth',authRoute)
app.use('/api/v1/users',userRoute)
app.use('/api/v1/post',postRoute)
app.use('/api/v1/notification',notificationRoute)


app.listen(PORT,()=>{
    console.log(`server is listning at ${PORT}`);
    connectDB();
})


