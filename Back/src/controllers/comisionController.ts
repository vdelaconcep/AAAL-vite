import Comision from "../models/comisionModel.js";
import type { Request, Response } from "express";
import type { NewComisionData } from "../types/comisionTypes.js";

interface GetMembersParam {
    from: string 
}

export async function getMembers(req: Request<GetMembersParam> , res: Response) {
    const { from } = req.params;
    console.log(from)

    try {
        const members = await Comision.getAllMembers(from);
        res.status(200).json(members)
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        res.status(500).json({error: errorMessage})
    }
};

export async function newComision(req: Request<{}, {}, NewComisionData>, res: Response) {
    const data = req.body;

    try {
        const newComisionEntry = await Comision.new(data);
        res.status(200).json(newComisionEntry)
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        res.status(500).json({error: errorMessage})
    }
}