import { Wrench } from "lucide-react"

interface AdminOptionsButtonProps {
    showAdminOptions: boolean
    setShowAdminOptions: (arg: boolean) => void
    addClass?: string
}

export default function AdminOptionsButton({ showAdminOptions, setShowAdminOptions, addClass }: AdminOptionsButtonProps) {
    return (
        <button
            className={`${addClass} rounded-md bg-gray-900 border-black border-2 p-4`}
            type="button"
            onClick={() => setShowAdminOptions(!showAdminOptions)}
        >
            <Wrench size={20} className="text-white"/>
        </button>
    )
}