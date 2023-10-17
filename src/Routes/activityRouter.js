import express from 'express';
import { feedData , createPost , editPost , deletePost } from '../Controller/activityRouter.js';
const activityRouter = express.Router(); 

activityRouter.get('/activity', feedData) 
activityRouter.post('/activity', createPost) 
activityRouter.put('/activity', editPost) 
activityRouter.delete('/activity', deletePost) 

export default activityRouter
