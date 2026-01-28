import type { whatsappContact } from "@/components/whatsapp/whatsappContacts";

export default function WhatsappDialog({ contacts }: {contacts: whatsappContact[]}) {
    return (
        <div
            className="bg-gray-300 border-2 border-[#6E1538] px-2 md:px-6 py-2 rounded-lg shadow-md shadow-gray-500 w-full sm:max-w-sm"
            onClick={(e)=>e.stopPropagation()}>
            <h3 className="text-center text-gray-900 mb-3 text-lg font-bold wrap-break-word">
                Comunicate por whatsapp <i className="fa-brands fa-whatsapp text-2xl ml-2"></i>
            </h3>
            <div>
            {contacts.map(contact =>
                <article
                    key={contact.name}
                    className="flex items-center py-2 border-b border-b-gray-400 last:border-b-0">
                    <p className="w-2/3 pl-3 wrap-break-word mr-4">
                        {contact.name}
                    </p>
                    <div className="w-1/3 flex justify-end">
                        <a
                            className="rounded-xl text-white font-medium bg-[#36BB68] px-4 py-1 mr-3 hover:bg-[#06a543] shadow-sm shadow-gray-800 transition-colors duration-200 cursor-pointer"
                            href={`https://wa.me/${contact.phone}?text=Hola%20mi%20nombre%20es`}
                            target="_blank"
                            title="Enviar mensaje por whatsapp"
                            rel="noopener noreferrer">
                            mensaje
                        </a>
                    </div>
                </article>
            )}
            </div>
        </div>
    )
}