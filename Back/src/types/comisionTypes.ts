import { RowDataPacket } from 'mysql2';

export type NewComisionData = {
    fromDate: Date | string,
    toDate?: Date | string,
    presidente: string,
    vicepresidente: string,
    secretario: string,
    prosecretario: string,
    tesorero: string,
    protesorero: string, 
    vocalesTitulares: string[],
    vocalesSuplentes: string[],
    revisoresDeCuentas: string[]
}

export type ComisionRow = {
    id: string;
    fromDate: Date;
    toDate: Date | null;
    presidente: string;
    vicepresidente: string;
    secretario: string;
    prosecretario: string;
    tesorero: string;
    protesorero: string;
    vocalesTitulares: string;
    vocalesSuplentes: string;
    revisoresDeCuentas: string;
    created_at: Date;
}

export type ComisionRowDB = ComisionRow & RowDataPacket