import express from "express";

import { createVdo, getVdo, getVideoById ,updateVideoById,deleteVideoById} from "../Controller/yogaRouter.js";

const workoutRouter = express();

// Endpoint http://localhost:8000/getyoga
// Method GET
// Access Publish
workoutRouter.get("/getyoga", getVdo);

// Endpoint http://localhost:8000/getyoga/:id
// Method GET
// Access Publish
workoutRouter.get("/getyoga/:id", getVideoById);

// Endpoint http://localhost:8000/createyoga
// Method POST
// Access Publish
workoutRouter.post("/createyoga", createVdo);

// Endpoint http://localhost:8000/updateyoga
// Method POST
// Access Publish
workoutRouter.put("/updateyoga", updateVideoById);


// Endpoint http://localhost:8000/deleteyoga
// Method POST
// Access Publish
workoutRouter.delete("/Deleteyoga", deleteVideoById);



export default workoutRouter;
