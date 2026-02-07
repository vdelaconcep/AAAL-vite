import { X } from 'lucide-react';

interface CloseButtonProps {
    action: () => void
}

export default function CloseButton({action}: CloseButtonProps) {
    return (
        <button
                onClick={action}
                title="Cerrar"
                className="absolute top-2 md:top-4 right-2 md:right-4 text-gray-300 hover:text-white transition-colors z-20 bg-black bg-opacity-50 rounded-full p-2 cursor-pointer"
                aria-label="Cerrar"
            >
                <X size={32} />
            </button>
    )
}