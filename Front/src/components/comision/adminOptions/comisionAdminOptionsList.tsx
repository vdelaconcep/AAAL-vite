import { Plus, FilePenLine, FileSearch2 } from "lucide-react";
import { useState } from "react";
import ComisionForm from "./comisionForm";
import ComisionPrevious from "./comisionPrevious";
import type { ComisionData } from "@/types/comisionDataTypes";

interface ComisionAdminOptionsListProps {
    data?: ComisionData & {
        created_at: string
    }
}

export default function ComisionAdminOptionsList({data}: ComisionAdminOptionsListProps) {

    const [showForm, setShowForm] = useState<'previous' | 'update' | 'new' | ''>('');

    return (
        <>
            <ul className="font-light">
            <li className="hover:bg-gray-700 p-2 px-4">
                <button
                    className="w-full h-full flex items-center cursor-pointer"
                    onClick={()=> setShowForm('new')}>
                Agregar lista nueva <Plus size={22}className="ml-2" />
                </button>
            </li>
            <li className="hover:bg-gray-700 p-2 px-4">
                <button
                    className="w-full h-full flex items-center cursor-pointer"
                    onClick={()=> setShowForm('update')}>
                Modificar lista actual <FilePenLine size={22} className="ml-2" />
                </button>
            </li>
            <li className="hover:bg-gray-700 p-2 px-4 rounded-b-md">
                    <button
                        className="w-full h-full flex items-center cursor-pointer"
                        onClick={()=> setShowForm('previous')}>
                    Ver todas las listas <FileSearch2 size={22} className="ml-2" />
                </button>
            </li>
            </ul>
            {(showForm === 'new' || showForm === 'update') ?
                <ComisionForm
                    updateData={showForm === 'update' ? data : null}
                    setShowForm={setShowForm}
                    showForm={showForm} /> :
                showForm === 'previous' ?
                    <ComisionPrevious
                        setShowForm={setShowForm}/> : ''}
        </>
    )
}