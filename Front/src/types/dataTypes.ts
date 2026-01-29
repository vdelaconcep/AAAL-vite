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