import express from "express";


import  { getUserperday,getUserdata,findVideo,addlastVideo, getUser , updatePassword , updateProfile,sendOTP ,rePass,createImage} from "../Controller/userRouter.js";

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


// Endpoint http://localhost:8000/addlastVideo
// Method POST
// Access private
userRouter.post("/addlastVideo",auth,addlastVideo);


// Endpoint http://localhost:8000/findlastVideo
// Method get
// Access private
userRouter.get("/findlastVideo",auth,findVideo);

// Endpoint http://localhost:8000/getUserdata
// Method get
// Access private
userRouter.get("/getUserdata",auth,getUserdata);

// Endpoint http://localhost:8000/getUserperday
// Method get
// Access private
userRouter.get("/getUserperday",auth,getUserperday);






export default userRouter
