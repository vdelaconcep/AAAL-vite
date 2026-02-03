import { Plus, FilePenLine, FileSearch2 } from "lucide-react";
import { motion } from "framer-motion";

interface ComisionAdminOptionsListProps {
    showAdminOptions: boolean
    addClass?: string
}

export default function ComisionAdminOptionsList({ showAdminOptions, addClass} : ComisionAdminOptionsListProps) {
    return (
        <motion.article
            className={`${addClass} rounded-md bg-gray-700 shadow-sm shadow-gray-600 border-black border-2 cursor-pointer absolute top-5 left-19 overflow-hidden text-white text-lg`}
            >
            <div className="p-2 font-semibold">
                Comisión Directiva:
            </div>
            <hr className="text-gray-400"/>
            <ul>
                <li className="hover:bg-gray-900 flex items-center p-2">Agregar lista nueva <Plus size={22} className="ml-2"/></li>
                <li className="hover:bg-gray-900 flex items-center p-2">Modificar lista actual <FilePenLine size={22} className="ml-2"/></li>
                <li className="hover:bg-gray-900 flex items-center p-2">Ver anteriores <FileSearch2 size={22} className="ml-2"/></li>
            </ul>
        </motion.article>
        
    )
}