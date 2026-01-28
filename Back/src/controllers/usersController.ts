import type { Request, Response } from "express";
import Users from "../models/usersModel.js";
import type { UserData, NewUserData } from "../types/usersTypes.ts";
import jwt from 'jsonwebtoken';

export async function userLogin(req: Request<{}, {}, UserData>, res: Response) {
    try {
        const data = req.body;

        const user = await Users.login(data);

        if (!user.success) return res.status(400).json(user)
        
        const secret = process.env.JWT_SECRET

        if (!secret) return res.status(400).json({
            success: false,
            message: "JWT_SECRET no encontrado entre las variables de entorno"
        })

        const token = jwt.sign(
            { id: user.id, email: user.email },
            secret,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            ...user,
            token
        })

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        res.status(500).json({error: errorMessage})
    }
}

export async function userRegister(req: Request<{}, {}, NewUserData>, res: Response) {
    try {
        const data = req.body;

        const newUser = await Users.register(data)

        return res.status(200).json(newUser)
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        res.status(500).json({error: errorMessage})
    }
}