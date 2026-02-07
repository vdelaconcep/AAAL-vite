import Comision from "../models/comisionModel.js";
import type { Request, Response } from "express";
import type { NewComisionData } from "../types/comisionTypes.js";


export async function getSelected(req: Request, res: Response) {

    try {
        const result = await Comision.getSelectedRow();
        res.status(200).json(result)
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        res.status(500).json({error: errorMessage})
    }
};

export async function newComision(req: Request<{}, {}, NewComisionData>, res: Response) {
    const data = req.body;

    try {
        const result = await Comision.new(data);
        res.status(200).json(result)
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        res.status(500).json({error: errorMessage})
    }
}

export async function selectComisionToShow(req: Request<{ selectedId: string }>, res: Response) {
    const { selectedId } = req.params;

    if (!selectedId || selectedId.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Se requiere ingresar el id'
        })
    }

    if (selectedId.length > 36) {
        return res.status(400).json({
            success: false,
            message: 'Se requiere ingresar el id'
        })
    }

    try {
        const result = await Comision.setAsSelected(selectedId);
        res.status(200).json(result)
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        res.status(500).json({ error: errorMessage })
    }

}

export async function updateComision(req: Request<{}, {}, NewComisionData>, res: Response) {
    const data = req.body;

    try {
        const result = await Comision.updateSelected(data);
        res.status(200).json(result)
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        res.status(500).json({ error: errorMessage })
    }
}

export async function deleteComision(req: Request<{id: string}>, res: Response) {
    const { id } = req.params;

    try {
        const result = await Comision.delete(id);
        res.status(200).json(result)
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        res.status(500).json({ error: errorMessage })
    }
}

export async function getAll(req: Request, res: Response) {
    try {
        const result = await Comision.getAllRows();
        res.status(200).json(result)
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        res.status(500).json({ error: errorMessage })
    }
}