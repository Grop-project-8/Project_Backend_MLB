import express from "express";

import { register,login,currentUser,logOut ,checkId} from "../Controller/authRouter.js";

import { auth } from '../middleware/auth.js'



const authRouter = express()

// Endpoint http://localhost:8000/register
// Method POST
// Access Publish
authRouter.post("/register",register)

// Endpoint http://localhost:8000/login
// Method POST
// Access Publish
authRouter.post("/login",login);

// Endpoint http://localhost:8000/checkId
// Method POST
// Access Pulish
authRouter.post("/checkid",checkId);

// Endpoint http://localhost:8000/logout
// Method POST
// Access Pulish
authRouter.post("/logout",logOut);

// Endpoint http://localhost:8000/currentUser
// Method GET
// Access Private
authRouter.get("/currentUser", auth, currentUser);


export default authRouter
// 