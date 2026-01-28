import pool from "../config/mysql.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import type { NewUserData, UserData, UsersRowDB, LoginResult, LoginFailure } from "../types/usersTypes.js";

export default class Users {

    static async register(data: NewUserData) {

        try {
            await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id CHAR(36) NOT NULL PRIMARY KEY,
            name VARCHAR(60) NOT NULL UNIQUE,
            email VARCHAR(60) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT NULL,
            last_login_at TIMESTAMP DEFAULT NULL
            )`);

            const id = uuidv4();

            const hash = bcrypt.hashSync(data.password, 10)

            await pool.query(`
                INSERT INTO users (id, name, email, password_hash)
                VALUES (?, ?, ?, ?)`,
                [
                    id,
                    data.name,
                    data.email,
                    hash
                ]
            )

            return {
                success: true,
                message: 'Usuario registrado con éxito',
                id
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            throw new Error('Error al registrar usuario: ' + errorMessage)
        }
    }

    static async login(data: UserData): Promise<LoginResult> {
        try {
            const [rows] = await pool.query<UsersRowDB[]>(`
                SELECT id, name, email, password_hash
                FROM users
                WHERE email = ?
                LIMIT 1`, [data.email])
            
            const user = rows[0];

            const failReturn: LoginFailure = {
                success: false,
                message: "E-mail o contraseña incorrectos"
            }

            if (!user) return failReturn

            const passwordOk = await bcrypt.compare(data.password, user.password_hash)
            
            if (!passwordOk) return failReturn

            await pool.query(`
                UPDATE users 
                SET last_login_at = NOW() 
                WHERE id = ?`, [user.id])
            
            return {
                success: true,
                message: "Login exitoso",
                ...user
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            throw new Error('Error al comprobar usuario o contraseña: ' + errorMessage)
        }
    }
}