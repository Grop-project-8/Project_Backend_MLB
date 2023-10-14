import express from "express";


import { getUser , updatePassword , updateProfile  } from "../Controller/userRouter.js";

import { auth } from '../middleware/auth.js'



const userRouter = express()

// Endpoint http://localhost:8000/getUser
// Method GET
// Access Private
userRouter.get("/getUser", auth, getUser);


// Endpoint http://localhost:8000/updatePassword
// Method PUT
// Access Private
userRouter.put("/updatePassword", auth, updatePassword);


// Endpoint http://localhost:8000/updateProfile
// Method PUT
// Access Private
userRouter.put("/updateProfile", auth, updateProfile);


export default userRouter
