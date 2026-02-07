import express from "express";

import { newComision, getSelected, selectComisionToShow, updateComision, deleteComision, getAll } from "../controllers/comisionController.js";
import { comisionValidator } from "../helpers/comisionValidator.js";
import { validationMid } from "../middlewares/validationMid.js"

const router = express.Router();

router.get('/selected', getSelected);

router.get('/all', getAll)

router.post('/new', comisionValidator, validationMid, newComision);

router.patch('/:selectedId/select', selectComisionToShow);

router.put('/update', comisionValidator, validationMid, updateComision);

router.delete('/delete/:id', deleteComision)

export default router;