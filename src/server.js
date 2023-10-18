import express from "express";
import "dotenv/config";
import connectDB from "./Config/db.js";
import middleware from "./servermiddleware.js";
import authRouter from "./Routes/authRouter.js";
import userRouter from "./Routes/userRouter.js";
import activityRouter from "./Routes/activityRouter.js";
import yogaRouter from "./Routes/yogaRouter.js";

// เชื่อมต่อ Mongodb

connectDB();

const app = express();

//middleware
app.use(middleware);
app.use(express.json());

// Routes
app.use(authRouter);
app.use(userRouter);
app.use(activityRouter);
app.use(yogaRouter);


const port = process.env.PORT;
// Start port
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
