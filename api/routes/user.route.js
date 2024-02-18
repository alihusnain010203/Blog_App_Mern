import express from 'express';
import { updateUser,deleteUser, getAllUsers, getUser } from '../controller/user.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.get("/getallusers",getAllUsers)

router.put("/update/:id",verifyUser,updateUser)



router.delete("/delete/:id",verifyUser,deleteUser)

router.get('/:userId', getUser);


export default router; 