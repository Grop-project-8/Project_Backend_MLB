import express from "express";

import { createYoga, getyoga, getVideoById ,updateYogaVideoById,deleteYogaVideoById} from "../Controller/yogaRouter.js";

const workoutRouter = express();

// Endpoint http://localhost:8000/getyoga
// Method GET
// Access Publish
workoutRouter.get("/getyoga", getyoga);

// Endpoint http://localhost:8000/getyoga/:id
// Method GET
// Access Publish
workoutRouter.get("/getyoga/:id", getVideoById);

// Endpoint http://localhost:8000/createyoga
// Method POST
// Access Publish
workoutRouter.post("/createyoga", createYoga);

// Endpoint http://localhost:8000/updateyoga
// Method POST
// Access Publish
workoutRouter.put("/updateyoga", updateYogaVideoById);


// Endpoint http://localhost:8000/deleteyoga
// Method POST
// Access Publish
workoutRouter.delete("/Deleteyoga", deleteYogaVideoById);



export default workoutRouter;
