export type ComisionData = {
    fromDate: string,
    toDate?: string | null,
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