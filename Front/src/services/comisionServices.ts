import { apiClient } from "@/services/apiClient";
import type { NewComisionData } from "@/types/comisionTypes";

export function getMembers(from: string) {
    return apiClient.get(`/api/comision/${from}`);
};

export function newComision(data: NewComisionData) {
    return apiClient.post(`/api/comision/new`, data)
}