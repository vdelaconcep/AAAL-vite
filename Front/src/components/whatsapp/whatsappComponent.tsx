import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from 'lucide-react';
import WhatsappButton from "@/components/whatsapp/whatsappButton";
import WhatsappDialog from "@/components/whatsapp/whatsappDialog";
import { whatsappContacts } from "@/components/whatsapp/whatsappContacts";

export default function WhatsappComponent() {

    const [showDialog, setShowDialog] = useState<boolean>(false);

    useEffect(() => {
        const closeDialogEsc = (event: KeyboardEvent) => {
            if (showDialog && event.key === "Escape") setShowDialog(false);
        };

        document.addEventListener('keydown', closeDialogEsc);

        return () => {
            document.removeEventListener('keydown', closeDialogEsc);
        };

    }, [showDialog, setShowDialog]);

    return (
        <>
        <section className="sticky bottom-0 w-full pointer-events-none z-40">
            <div className="flex justify-end pr-5 pointer-events-auto">
                    <WhatsappButton
                    addClass="absolute bottom-5 right-5 z-40"
                    setShowDialog={setShowDialog}/>
            </div>
        </section>
            
        {showDialog &&
            <div
                className='fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center px-2'
                onClick={() => setShowDialog(false)}>
                <button
                    onClick={() => setShowDialog(false)}
                    className="absolute top-2 md:top-4 right-2 md:right-4 text-white hover:text-gray-300 transition-colors z-20 bg-black bg-opacity-50 rounded-full p-2"
                    aria-label="Cerrar"
                >
                    <X size={32} />
                </button>
                <motion.div
                    className="mx-auto relative"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1, transition: { duration: 0.4 } }}>
                        <WhatsappDialog
                        contacts={whatsappContacts}/>
                </motion.div>
            </div>
        }
        </>
    )
};