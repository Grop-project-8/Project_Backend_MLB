import express from "express";


import  {  getUser , updatePassword , updateProfile,sendOTP ,rePass,createImage} from "../Controller/userRouter.js";

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

// Endpoint http://localhost:8000/sendOTP
// Method POST
// Access Publish
userRouter.post("/sendOTP",sendOTP);

// Endpoint http://localhost:8000/rePass
// Method POST
// Access private
userRouter.post("/rePass",rePass);

// Endpoint http://localhost:8000/createImage
// Method POST
// Access private
userRouter.post("/createImage",auth,createImage);






export default userRouter
