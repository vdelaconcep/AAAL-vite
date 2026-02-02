import express from "express";

import { newComision, getSelected, selectComisionToShow, updateComision } from "../controllers/comisionController.js";
import { comisionValidator } from "../helpers/comisionValidator.js";
import { validationMid } from "../middlewares/validationMid.js"

const router = express.Router();

router.get('/selected', getSelected);

router.post('/new', comisionValidator, validationMid, newComision);

router.patch('/:selectedId/select', selectComisionToShow);

router.put('/:id/update', comisionValidator, validationMid, updateComision);

export default router;