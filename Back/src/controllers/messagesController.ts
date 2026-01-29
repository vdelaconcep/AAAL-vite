import type { Request, Response } from "express";
import Messages from "../models/messagesModel.js";
import type { NewMessageType } from "../types/messagesTypes.js";

export async function sendMessage(req: Request<{}, {}, NewMessageType>, res: Response) {
    const data = req.body;
    
    try {
        const message = await Messages.newMessage(data);

        return res.status(200).json(message)

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        res.status(500).json({ error: errorMessage })
    }
}