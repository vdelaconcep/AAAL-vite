import express from "express";

import { userLogin, userRegister } from "../controllers/usersController.js";
import { registerValidator, loginValidator } from "../helpers/userValidator.js";
import { validationMid } from "../middlewares/validationMid.js"

const router = express.Router();

router.post('/login', loginValidator, validationMid, userLogin);

router.post('/register', registerValidator, validationMid, userRegister)

export default router;