import { validationResult } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';

export function validationMid (req: Request, res: Response, next: NextFunction) {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        const mensajes = errores.array().map(err => err.msg);
        return res.status(400).json({ error: mensajes });
    }
    next();
};