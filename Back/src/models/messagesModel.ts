import pool from "../config/mysql.js";
import { v4 as uuidv4 } from 'uuid';
import type { NewMessageType } from "../types/messagesTypes.js";

export default class Messages {

    static async newMessage(data: NewMessageType) {

        try {
            await pool.query(`
            CREATE TABLE IF NOT EXISTS messages(
            id CHAR(36) NOT NULL PRIMARY KEY,
            name VARCHAR(60) NOT NULL,
            email VARCHAR(60) NOT NULL,
            phone INT,
            subject VARCHAR(100) NOT NULL,
            message VARCHAR(1000) NOT NULL,
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            received_at TIMESTAMP DEFAULT NULL,
            reply VARCHAR(1000),
            replied_at TIMESTAMP DEFAULT NULL,
            replied_by CHAR(36) REFERENCES users(id) ON DELETE SET NULL
            )`)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            throw new Error('Error al enviar mensaje: ' + errorMessage)
        }

        const id = uuidv4();

        await pool.query(`
            INSERT INTO messages (id, name, email, phone, subject, message)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                id,
                data.name,
                data.email,
                data.phone,
                data.subject,
                data.message
            ]
        )

        return {
            success: true,
            message: 'Mensaje enviado con éxito',
            id
        }
    }
}