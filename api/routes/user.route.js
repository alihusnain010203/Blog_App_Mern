import express from 'express';
import { updateUser,deleteUser, getAllUsers } from '../controller/user.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.get("/getallusers",verifyUser,getAllUsers)

router.put("/update/:id",verifyUser,updateUser)



router.delete("/delete/:id",verifyUser,deleteUser)


export default router; 