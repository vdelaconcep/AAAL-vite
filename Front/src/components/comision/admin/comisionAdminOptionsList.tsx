import { Plus, FilePenLine, FileSearch2 } from "lucide-react";
import { useState } from "react";
import ComisionNew from "./comisionNew";

export default function ComisionAdminOptionsList() {

    const [showForm, setShowForm] = useState<'previous' | 'update' | 'new' | ''>('');

    return (
        <>
            <ul className="font-light">
            <li className="hover:bg-gray-700 p-2 px-4">
                    <button
                        className="w-full h-full flex items-center cursor-pointer"
                        onClick={()=> setShowForm('new')}>
                    Agregar lista nueva <Plus size={22} className="ml-2" />
                </button>
            </li>
            <li className="hover:bg-gray-700 p-2 px-4">
                <button className="w-full h-full flex items-center cursor-pointer">
                    Modificar lista actual <FilePenLine size={22} className="ml-2" />
                </button>
            </li>
            <li className="hover:bg-gray-700 p-2 px-4 rounded-b-md">
                <button className="w-full h-full flex items-center cursor-pointer">
                    Ver anteriores <FileSearch2 size={22} className="ml-2" />
                </button>
            </li>
            </ul>
            {showForm === 'new' &&
                <ComisionNew setShowForm={setShowForm} showForm={showForm} />}
        </>
    )
}