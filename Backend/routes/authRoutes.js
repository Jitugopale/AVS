import express from "express";
import { body } from 'express-validator';
import { createUserController } from "../controllers/authController.js";
import { loginController } from "../controllers/authController.js";
import { getuserController } from "../controllers/authController.js";
import fetchuser from '../middleware/fetchUser.js'

const router = express.Router()
router.post('/createUser',[
    body('fname', 'Enter a valid fname').isLength({ min: 3 }),
    body('Lname', 'Enter a valid Lname').isLength({ min: 3 }),
    body('Address', 'Enter a valid Address').isLength({ min: 3 }),
    body('PhoneNo', 'Enter a valid PhoneNo').isLength({ min: 10, max: 10 }).matches(/^[0-9]{10}$/),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
    body('City', 'Enter a City').isLength({ min: 3 }),

  ],createUserController

)
router.post('/login',[
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
  ],loginController

)
router.get('/getuser',fetchuser,getuserController

)

export default router;