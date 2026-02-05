import { Wrench, X } from "lucide-react"
import { forwardRef } from "react"
import { useAdminOptions } from "@/context/adminOptionsContext"

export default forwardRef<HTMLButtonElement | null, {}>(function AdminOptionsButton(props, ref) {

    const { showList, toggleList } = useAdminOptions();

    return (
        <div className={`rounded-lg bg-black p-[2px] hover:shadow-sm hover:shadow-gray-600 cursor-pointer absolute top-4 left-4 z-7`}>
            <button
            ref={ref}
            className={`rounded-md text-white bg-black hover:bg-gray-700 border-white border-2 p-1.5 cursor-pointer`}
            type="button"
            onClick={toggleList}
        >
            {showList ? <X size={28}/> : <Wrench size={28}/>}
            
            </button>
        </div>
        
    )
})