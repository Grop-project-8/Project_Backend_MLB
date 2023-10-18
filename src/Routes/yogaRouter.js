import express from "express";

import { createYoga } from "../Controller/yogaRouter.js";


const yogaRouter = express()

// Endpoint http://localhost:8000/createyoga
// Method POST
// Access Publish
yogaRouter.post("/createyoga",createYoga)




export default yogaRouter
