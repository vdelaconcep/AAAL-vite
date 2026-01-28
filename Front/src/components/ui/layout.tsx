import { Outlet } from "react-router-dom";
import Header from "@/components/ui/header";
import NavigationComponent from "@/components/navigation/navigationComponent";
import Footer from "@/components/ui/footer";
import WhatsappComponent from "@/components/whatsapp/whatsappComponent";

const Layout = () => {
    return (
        <div className="bg-gray-800 min-h-dvh flex justify-center">
            <div className="relative flex flex-col w-full max-w-[1250px] min-h-dvh">
                <div>
                    <Header />
                    <NavigationComponent />
                </div>
                <div className="flex-1">
                    <Outlet />
                </div>
                <Footer />
                <WhatsappComponent />
            </div>
        </div>
    );
};

export default Layout;