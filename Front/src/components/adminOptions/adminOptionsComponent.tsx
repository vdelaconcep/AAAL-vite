import AdminOptionsContent from "./adminOptionsContent";
import { AdminOptionsProvider } from "@/context/adminOptionsContext";

interface AdminOptionsComponentProps {
    children: React.ReactNode
}

export default function AdminOptionsComponent({ children }: AdminOptionsComponentProps) {
    return (
        <AdminOptionsProvider>
            <AdminOptionsContent>{children}</AdminOptionsContent>
        </AdminOptionsProvider>
    );
}