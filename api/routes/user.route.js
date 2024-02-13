import express from 'express';
import { updateUser,deleteUser } from '../controller/user.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

router.put("/update/:id",verifyUser,updateUser)

router.delete("/delete/:id",verifyUser,deleteUser)


export default router; 