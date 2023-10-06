import express from 'express';
import connectDB from './src/Config/db.js';
import "dotenv/config";
import middleware from './src/servermiddleware.js'
import authRouter from './src/Routes/authRouter.js'



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
