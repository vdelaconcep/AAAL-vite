import { apiClient } from "@/services/apiClient";

export function getEventById(id: string) {
    return apiClient.get(`/events/${id}`);
};