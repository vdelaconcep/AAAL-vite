import type { JSX } from "react"

interface MainButtonProps {
    type?: 'button' | 'submit' | 'reset'
    text?: string | JSX.Element
    action?: (...args: any []) => any
    addClass?: string
    disabled?: boolean
    secondary?: boolean
    forDelete?: boolean
}


export default function MainButton({ type, text, action, addClass, disabled, secondary, forDelete }: MainButtonProps) {

    const roundedClass = addClass?.includes('rounded') ? '' : 'rounded-xl'

    const primaryColors = disabled ? 'bg-[#4e0e28] text-[#704858]' : 'bg-[#6E1538] text-white hover:bg-[#4e0e28]'
    const secondaryColors = disabled ? 'bg-cyan-900 text-cyan-100' : 'bg-cyan-800 hover:bg-cyan-900 text-white'
    const deleteColors = disabled ? 'bg-black text-gray-300' : 'bg-black text-white hover:bg-gray-800'

    return (
        <button
            className={`${secondary ? secondaryColors : forDelete? deleteColors : primaryColors} font-medium cursor-pointer p-2 px-3 ${roundedClass} shadow-gray-900 shadow-sm ${addClass || ''}`}
            type={type}
            onClick={action}
        >
            {text ?? (secondary ? 'cancelar' : 'Aceptar')}
        </button>
    )
};