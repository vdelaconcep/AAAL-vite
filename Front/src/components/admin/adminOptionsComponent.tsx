import AdminOptionsContent from "./adminOptionsContent";
import { ConfirmProvider } from "@/context/confirmContext";
import ConfirmComponent from "../ui/confirmComponent";
import { AdminOptionsProvider } from "@/context/adminOptionsContext";

interface AdminOptionsComponentProps {
    children: React.ReactNode
}

export default function AdminOptionsComponent({ children }: AdminOptionsComponentProps) {
    return (
        <AdminOptionsProvider>
            <ConfirmProvider>
                <AdminOptionsContent>{children}</AdminOptionsContent>
                <ConfirmComponent />
            </ConfirmProvider>
        </AdminOptionsProvider>
    );
}