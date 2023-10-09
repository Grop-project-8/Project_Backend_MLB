import express from 'express';
import "dotenv/config";
import connectDB from './Config/db.js';
import middleware from './servermiddleware.js'
import authRouter from './Routes/authRouter.js'



// เชื่อมต่อ Mongodb
connectDB()

const app = express();


//middleware
app.use(middleware)

// Routes
app.use(authRouter)





const port = process.env.PORT ;
// Start port
app.listen(port,()=>{
    console.log(`Server is running on ${port}`)
})