import { apiClient } from "@/services/apiClient";
import type { ComisionData } from "@/types/comisionDataTypes";

export function getSelected() {
    return apiClient.get(`/comision/selected`);
};

export function getAll() {
    return apiClient.get('/comision/all')
}

export function newComision(data: ComisionData) {
    return apiClient.post(`/comision/new`, data)
}

export function selectComisionToShow(id: string) {
    return apiClient.patch(`/comision/${id}/select`)
}

export function updateComision(data: ComisionData) {
    return apiClient.put(`/comision/update`, data)
}

export function deleteComision(id: string) {
    return apiClient.delete(`/comision/delete/${id}`)
}