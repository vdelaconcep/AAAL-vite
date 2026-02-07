import { RowDataPacket } from 'mysql2';

export type NewComisionData = {
    fromDate: Date | string,
    toDate?: Date | string | null,
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
    id: string,
    fromDate: Date,
    toDate: Date | null,
    presidente: string,
    vicepresidente: string,
    secretario: string,
    prosecretario: string,
    tesorero: string,
    protesorero: string,
    vocalesTitulares: string,
    vocalesSuplentes: string,
    revisoresDeCuentas: string,
    created_at: Date,
    selectedToShow: boolean
}

export type ComisionRowDB = ComisionRow & RowDataPacket

interface ExisteResultType {
    existe: number
}

export type ExisteResultDB = ExisteResultType & RowDataPacket

interface IdResultType {
    id: string
}

export type IdResultDB = IdResultType & RowDataPacket