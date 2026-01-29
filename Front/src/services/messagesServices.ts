import { apiClient } from "@/services/apiClient";

type NewMessageDataType = {
    name: string
    email: string
    phone?: number | null
    subject: string
    message: string
}

export function sendMessage(data: NewMessageDataType) {
    return apiClient.post(`/messages/newMessage`, data);
};