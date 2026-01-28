import { Eye, EyeOff } from 'lucide-react'

interface ShowPasswordButtonProps {
    showPassword: boolean
    setShowPassword: (arg: boolean) => void
    addClass?: string
}

export default function ShowPasswordButton({showPassword, setShowPassword, addClass}: ShowPasswordButtonProps) {
    return (
        <button
            className={`${addClass} rounded-sm bg-none border-none active:border-none cursor-pointer p-2`}
            onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                setShowPassword(!showPassword)
            }}
            title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
            {showPassword ? <EyeOff size={20} className='text-gray-500' /> :
                <Eye size={20} className='text-gray-500' />}
        </button>
    )
}