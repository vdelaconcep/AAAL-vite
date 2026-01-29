import { RowDataPacket } from 'mysql2';

export type NewMessageType = {
    name: string
    email: string
    phone: number
    subject: string
    message: string
}