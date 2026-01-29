import express from "express";

import { sendMessage } from "../controllers/messagesController.js";
import { messageValidator } from "../helpers/messageValidator.js"
import { validationMid } from "../middlewares/validationMid.js"

const router = express.Router();

router.post('/newMessage', messageValidator, validationMid, sendMessage)

export default router;