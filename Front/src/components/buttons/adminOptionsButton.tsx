import { Wrench, X } from "lucide-react"

interface AdminOptionsButtonProps {
    showAdminOptions: boolean
    setShowAdminOptions: (arg: boolean) => void
    addClass?: string
}

export default function AdminOptionsButton({ showAdminOptions, setShowAdminOptions, addClass }: AdminOptionsButtonProps) {
    return (
        <button
            className={`${addClass} rounded-md text-white bg-gray-700 hover:bg-gray-900 hover:shadow-sm hover:shadow-gray-600 border-black border-2 p-2 cursor-pointer absolute top-5 left-5`}
            type="button"
            onClick={() => setShowAdminOptions(!showAdminOptions)}
        >
            {showAdminOptions ? <X size={28}/> : <Wrench size={28}/>}
            
        </button>
    )
}