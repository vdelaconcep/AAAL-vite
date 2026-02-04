import { Wrench, X } from "lucide-react"
import { forwardRef } from "react"
import { useAdminOptions } from "@/context/adminOptionsContext"

export default forwardRef<HTMLButtonElement | null, {}>(function AdminOptionsButton(props, ref) {

    const { showList, toggleList } = useAdminOptions();

    return (
        <button
            ref={ref}
            className={`rounded-md text-white bg-gray-700 hover:bg-gray-900 hover:shadow-sm hover:shadow-gray-600 border-black border-2 p-2 cursor-pointer absolute top-5 left-4 z-7`}
            type="button"
            onClick={toggleList}
        >
            {showList ? <X size={28}/> : <Wrench size={28}/>}
            
        </button>
    )
})