import express from "express";

import { newComision, getMembers } from "../controllers/comisionController.js";
import { comisionValidator } from "../helpers/comisionValidator.js";
import { validationMid } from "../middlewares/validationMid.js"

const router = express.Router();

router.get('/:from', getMembers);

router.post('/new', comisionValidator, validationMid, newComision)

export default router;