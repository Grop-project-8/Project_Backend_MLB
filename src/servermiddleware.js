import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from 'cors';
import "dotenv/config";

const corsOptions = {
    origin: 'https://mlbproject-aavjuooi9-mlb.vercel.app', 
    methods: "GET,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204, 
  };

const middleware = express();

middleware.use(cors(corsOptions))
middleware.use(helmet());
middleware.use(express.json({ limit: '50mb' })); 
middleware.use(express.urlencoded({ limit: '50mb', extended: true }));
middleware.use(morgan("dev")); 
middleware.use(cookieParser());


export default middleware;
