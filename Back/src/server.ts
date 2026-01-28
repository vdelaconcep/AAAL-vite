import 'dotenv/config';
import app from './app.js'
import pool from './config/mysql.js';
import { RowDataPacket } from 'mysql2';

interface TimeResult extends RowDataPacket {
    hora: Date
}

const PORT = parseInt(process.env.PORT || '3000');
const HOST = process.env.HOST || 'localhost';

async function startServer() {
    try {
        const [rows] = await pool.query<TimeResult[]>("SELECT NOW() AS hora");
        console.log("Hora del servidor:", rows[0].hora);

        app.listen(PORT, HOST, () => {
            console.log(`Servidor escuchando en http://${HOST}:${PORT}`);
        });

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        console.error("❌ Error en la base de datos:", errorMessage);
        process.exit(1);
    }
}

startServer();