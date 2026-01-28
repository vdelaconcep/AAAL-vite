import type { JSX } from "react"

interface MainButtonProps {
    type?: 'button' | 'submit' | 'reset'
    text?: string | JSX.Element
    action?: (...args: any []) => any
    addClass?: string
    disabled?: boolean
    secondary?: boolean
}


export default function MainButton({ type, text, action, addClass, disabled, secondary }: MainButtonProps) {

    const roundedClass = addClass?.includes('rounded') ? '' : 'rounded-xl'

    const primaryColors = `${disabled ? 'bg-[#4e0e28] text-[#704858]' : 'bg-[#6E1538] text-white'} hover:bg-[#4e0e28]`
    const secondaryColors = 'bg-[#6B9795] hover:bg-[#5b817f] text-white'

    return (
        <button
            className={`${secondary ? secondaryColors : primaryColors} font-medium cursor-pointer p-2 px-3 ${roundedClass} shadow-gray-900 shadow-sm ${addClass || ''}`}
            type={type}
            onClick={action}
        >
            {text ?? (secondary ? 'cancelar' : 'Aceptar')}
        </button>
    )
};