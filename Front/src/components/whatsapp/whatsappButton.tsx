interface WhatsappButtonProps {
    addClass?: string,
    setShowDialog: (arg: boolean) => void
}

export default function WhatsappButton({ addClass, setShowDialog }: WhatsappButtonProps) {
    return (
        <button
            className={`${addClass || ''} bg-[#36BB68] text-white px-3 pt-[10px] pb-[7px] rounded-full shadow-md shadow-gray-900 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-108`}
            title="Contactar por whatsapp"
            onClick={() => setShowDialog(true)}>
            <i className="fa-brands fa-whatsapp text-4xl"></i>
        </button>
    )
}