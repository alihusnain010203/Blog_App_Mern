import express from 'express';
import {verifyUser} from '../utils/verifyUser.js'
import { createPost,getAllPostofAdmin } from '../controller/post.controller.js';
const router = express.Router();

router.post("/createpost",verifyUser,createPost);

// get all posts

router.get("/getallpost",verifyUser,getAllPostofAdmin);


export default router;