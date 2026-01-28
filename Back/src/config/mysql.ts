import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mysql, { Pool } from 'mysql2/promise';
import path from 'path';

let pool: Pool | undefined;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = path.resolve(__dirname, '../..');

let caCert = fs.readFileSync(path.join(projectRoot, 'certs', 'ca.pem'));

if (process.env.NODE_ENV !== 'desarrollo')  caCert = Buffer.from((process.env.DB_CA_CERT || '').replace(/\\n/g, '\n'));

try {
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        timezone: '-03:00',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: 'utf8mb4',
        connectAttributes: {
            characterEncoding: 'utf8mb4'
        },
        typeCast: function(field, next) {
            if (field.type === 'JSON') {
                const buffer = field.buffer();
                if (!buffer) return null;
                const value = buffer.toString('utf8');
                return value ? JSON.parse(value) : null;
            }
            return next();
        },
        ssl: {
            rejectUnauthorized: true,
            ca: caCert
        }
    });

    console.log("✅ Conexión exitosa a la base de datos");

} catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
    console.error('❌ Error al conectar a la base de datos:', errorMessage);
    throw err;
}

export default pool!;