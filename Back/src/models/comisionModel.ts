import pool from "../config/mysql.js";
import { v4 as uuidv4 } from 'uuid';
import type { NewComisionData, ComisionRowDB } from "../types/comisionTypes.js";

export default class Comision {

    static async new(data: NewComisionData) {

        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS comision(
                id CHAR(36) NOT NULL PRIMARY KEY,
                fromDate DATE NOT NULL,
                toDate DATE,
                presidente VARCHAR(50) NOT NULL UNIQUE,
                vicepresidente VARCHAR(50) NOT NULL UNIQUE,
                secretario VARCHAR(50) NOT NULL UNIQUE,
                prosecretario VARCHAR(50) NOT NULL UNIQUE,
                tesorero VARCHAR(50) NOT NULL UNIQUE,
                protesorero VARCHAR(50) NOT NULL UNIQUE,
                vocalesTitulares JSON NOT NULL,
                vocalesSuplentes JSON NOT NULL,
                revisoresDeCuentas JSON NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`);
            
            const id = uuidv4();

            await pool.query(`
                INSERT INTO comision (id, fromDate, toDate, presidente, vicepresidente, secretario, prosecretario, tesorero, protesorero, vocalesTitulares, vocalesSuplentes, revisoresDeCuentas)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    id,
                    data.fromDate,
                    data.toDate || null,
                    data.presidente,
                    data.vicepresidente,
                    data.secretario,
                    data.prosecretario,
                    data.tesorero,
                    data.protesorero,
                    JSON.stringify(data.vocalesTitulares),
                    JSON.stringify(data.vocalesSuplentes),
                    JSON.stringify(data.revisoresDeCuentas)
                ]
            )

            return {
                success: true,
                message: 'Comisión registrada con éxito',
                id
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            throw new Error('Error al registrar comisión: ' + errorMessage)
        }
        
    }

    static async getAllMembers(from: string) {
        try {
            const [rows] = await pool.query<ComisionRowDB[]>(`
                SELECT toDate, presidente, vicepresidente, secretario, prosecretario, tesorero, protesorero, vocalesTitulares, vocalesSuplentes, revisoresDeCuentas
                FROM comision
                WHERE fromDate = ?`,
                [from]
            );
            
            return rows;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            throw new Error('Error al obtener comisión: ' + errorMessage)
        }
    }
}