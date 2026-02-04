import { apiClient } from "@/services/apiClient";

export type NewComisionData = {
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

export function getSelected() {
    return apiClient.get(`/comision/selected`);
};

export function newComision(data: NewComisionData) {
    return apiClient.post(`/comision/new`, data)
}

export function selectComisionToShow(id: string) {
    return apiClient.patch(`/comision/${id}/select`)
}

export function updateComision(id: string, data: NewComisionData) {
    return apiClient.put(`/comision/${id}/update`, data)
}