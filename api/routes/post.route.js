import express from 'express';
import {verifyUser} from '../utils/verifyUser.js'
import { createPost,getAllPostofAdmin,deletePost, updatepost  } from '../controller/post.controller.js';
const router = express.Router();

router.post("/createpost",verifyUser,createPost);

// get all posts

router.get("/getallpost",getAllPostofAdmin);

router.delete("/deletepost/:postId/:userId",verifyUser,deletePost);

router.put('/updatepost/:postId/:userId', verifyUser, updatepost);
// router.put("/editpost",editPost);


export default router;