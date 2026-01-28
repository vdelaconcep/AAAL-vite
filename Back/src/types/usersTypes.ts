import { RowDataPacket } from 'mysql2';

export type UserData = {
    email: string,
    password: string
}

export type NewUserData = UserData & { name: string }

export type UsersRow = {
    id: string,
    name: string,
    email: string,
    password_hash: string,
    created_at?: string,
    updated_at?: string,
    last_login_at?: string
}

export type UsersRowDB = UsersRow & RowDataPacket

export type LoginFailure = {
    success: false
    message: string
}

export type LoginSuccess = {
    success: true;
    message: string;
    id: string;
    name: string;
    email: string;
    password_hash: string;
}

export type LoginResult = LoginFailure | LoginSuccess