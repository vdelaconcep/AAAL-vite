import pool from "../config/mysql.js";
import { v4 as uuidv4 } from 'uuid';
import type { NewComisionData, ComisionRowDB, ExisteResultDB, IdResultDB } from "../types/comisionTypes.js";
import type { ResultSetHeader } from "mysql2";

export default class Comision {

    static async new(data: NewComisionData) {

        const connection = await pool.getConnection();

        try {
            await connection.query(`
                CREATE TABLE IF NOT EXISTS comision(
                id CHAR(36) NOT NULL PRIMARY KEY,
                fromDate DATE NOT NULL,
                toDate DATE,
                presidente VARCHAR(50) NOT NULL,
                vicepresidente VARCHAR(50) NOT NULL,
                secretario VARCHAR(50) NOT NULL,
                prosecretario VARCHAR(50) NOT NULL,
                tesorero VARCHAR(50) NOT NULL,
                protesorero VARCHAR(50) NOT NULL,
                vocalesTitulares JSON NOT NULL,
                vocalesSuplentes JSON NOT NULL,
                revisoresDeCuentas JSON NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                selectedToShow BOOLEAN DEFAULT 1
                )`);
            
            const id = uuidv4();

            await connection.beginTransaction();

            try {
                await connection.query(`
                UPDATE comision SET selectedToShow = 0 WHERE selectedToShow = 1
                `);

                await connection.query(`
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
                );

                await connection.commit();

                return {
                    success: true,
                    message: 'Comisión registrada con éxito',
                    id
                }
            } catch (err) {
                await connection.rollback();
                throw err
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            throw new Error('Error al registrar comisión: ' + errorMessage)
        } finally {
            connection.release();
        }
        
    }

    static async updateSelected(data: NewComisionData) {
        try {
            const [updateResult] = await pool.query<ResultSetHeader>(`
                UPDATE comision
                SET fromDate = ?,
                    toDate = ?,
                    presidente = ?,
                    vicepresidente = ?,
                    secretario = ?,
                    prosecretario = ?,
                    tesorero = ?,
                    protesorero = ?,
                    vocalesTitulares = ?,
                    vocalesSuplentes = ?,
                    revisoresDeCuentas = ?
                WHERE selectedToShow = 1`,
                [
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
                ])
            
            if (updateResult.affectedRows === 0) {
                return {
                    success: false,
                    message: 'No se encontró la comisión seleccionada'
                }
            }

            return {
                success: true,
                message: 'Datos de comisión actualizados con éxito'
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            throw new Error('Error al actualizar comisión: ' + errorMessage)
        }
    } 

    static async setAsSelected(id: string) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            try {
                await connection.query(`
                UPDATE comision SET selectedToShow = 0 WHERE selectedToShow = 1
                `)

                const [updateResult] = await connection.query<ResultSetHeader>(`
                    UPDATE comision SET selectedToShow = 1 WHERE id = ?
                    `, [id]);
                
                if (updateResult.affectedRows === 0) {
                    await connection.rollback();
                    return {
                        success: false,
                        message: 'No se encontró la comisión con el id proporcionado'
                    }
                }

                await connection.commit();

                return {
                    success: true,
                    message: 'Comisión seleccionada con éxito'
                }
            } catch (err) {
                await connection.rollback();
                throw err;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            throw new Error('Error al seleccionar comisión: ' + errorMessage)
        } finally {
            connection.release();
        }
    }

    static async getSelectedRow() {
        try {
            const [rows] = await pool.query<ComisionRowDB[]>(`
                SELECT id, fromDate, toDate, presidente, vicepresidente, secretario, prosecretario, tesorero, protesorero, vocalesTitulares, vocalesSuplentes, revisoresDeCuentas, created_at
                FROM comision
                WHERE selectedToShow = 1`
            );
            
            return rows;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            throw new Error('Error al obtener comisión: ' + errorMessage)
        }
    }

    static async delete(id: string) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            try {
                const [deleteResult] = await connection.query<ResultSetHeader>(`
                DELETE FROM comision 
                WHERE id = ?
                `, [id])

                if (deleteResult.affectedRows === 0) {
                    await connection.rollback();
                    return {
                        success: false,
                        message: 'No se encontró la comisión con el id proporcionado'
                    }
                }

                const [selected] = await connection.query<ExisteResultDB[]>(`SELECT EXISTS(SELECT 1 FROM comision WHERE selectedToShow = 1) as existe`)

                if (selected[0].existe === 0) {
                    const [comisiones] = await connection.query < IdResultDB[]>(
                        'SELECT id FROM comision ORDER BY created_at DESC LIMIT 1'
                    );

                    if (comisiones.length > 0) {
                        await connection.query(
                            'UPDATE comision SET selectedToShow = 1 WHERE id = ?',
                            [comisiones[0].id]
                        );
                    }
                }

                await connection.commit();

                return {
                    success: true,
                    message: 'Comisión eliminada'
                }
            } catch (err) {
                await connection.rollback();
                throw err;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            throw new Error('Error al eliminar comisión: ' + errorMessage)
        } finally {
            connection.release();
        }
    }

    static async getAllRows() {
        try {
            const [rows] = await pool.query<ComisionRowDB[]>(`
                SELECT id, fromDate, toDate, presidente, vicepresidente, secretario, prosecretario, tesorero, protesorero, vocalesTitulares, vocalesSuplentes, revisoresDeCuentas, created_at, selectedToShow
                FROM comision`
            );

            return rows;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            throw new Error('Error al obtener datos: ' + errorMessage)
        }
    }
}