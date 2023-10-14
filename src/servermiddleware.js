import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from 'cors';
import "dotenv/config";

const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204, 
  };

const middleware = express();

middleware.use(cors(corsOptions))
middleware.use(helmet());
middleware.use(express.json());
middleware.use(express.urlencoded({ extended: true }));
middleware.use(morgan("dev")); 
middleware.use(cookieParser());


export default middleware;
