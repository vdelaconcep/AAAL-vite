
import { motion } from "framer-motion";
import ContactForm from "@/components/contact/contactForm";
import { sendMessage } from "@/services/messagesServices";
import { useAlert } from "@/context/alertContext";
import { useState } from "react";


export type FormDataType = {
    name: string
    email: string
    phone?: string
    subject: string
    message: string
}

export default function ContactComponent() {

    const { showAlert } = useAlert();

    const [sendingMessage, setSendingMessage] = useState(false);
    const [messageSent, setMessageSent] = useState(false);
    

    const onSubmit = async (data: FormDataType) => {
        const dataToSend = {
            ...data,
            phone: (data.phone && parseInt(data.phone)) || null
        }

        try {
            setSendingMessage(true);
            const res = await sendMessage(dataToSend);

            if (res.status !== 200) {
                const alertMessage = `Error al enviar mensaje: ${res.statusText}`;
                showAlert(alertMessage);
                return;
            };

            const alertMessage = 'Mensaje enviado';
            setMessageSent(true)
            showAlert(alertMessage, {addAction: () => setMessageSent(false)});
            return;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            const alertMessage = `Error al enviar mensaje: ${errorMessage}`;
            showAlert(alertMessage);
            return;
        } finally {
            setSendingMessage(false)
        }
    };

    return (
        <main className="h-full flex flex-col items-center bg-white py-7 md:py-10 px-4 text-gray-900">

            <div className="flex flex-col items-center mb-5">
                <h1 className="text-2xl md:text-3xl font-bold italic mb-2">Contacto</h1>
                <h6 className="text-md md:text-lg text-center md:text-left">Escribinos un mensaje y te responderemos a la brevedad</h6>
            </div>
            <motion.div
                className="w-full flex justify-center"
                initial={{ y: 30, opacity: 0 }}
                transition={{ duration: 0.8 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}>
                <ContactForm
                    onSubmit={onSubmit}
                    sendingMessage={sendingMessage}
                    messageSent={messageSent} />
            </motion.div>
            

        </main>
        
    )
};