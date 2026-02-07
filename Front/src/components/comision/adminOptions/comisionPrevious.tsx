import { useState, useEffect } from "react";
import { getAll, selectComisionToShow, deleteComision } from "@/services/comisionServices";
import { useRefetch } from "@/context/refetchContext";
import CloseButton from "@/components/buttons/closeButton";
import { useAdminOptions } from "@/context/adminOptionsContext";
import { motion, AnimatePresence } from "framer-motion";
import MainButton from "@/components/buttons/mainButton";
import { useAlert } from "@/context/alertContext";
import axios from "axios";
import formatUTCDate from "@/utils/formatUTCDate";
import dateToShow from "@/utils/dateToShow";
import type { ComisionData } from "@/types/comisionDataTypes";

interface ComisionPreviousProps {
    setShowForm: (form:'previous'| '') => void
}

type DataType = ComisionData & {
    selectedToShow: 1 | 0
    id: string
    created_at: string
}

export default function ComisionPrevious({setShowForm}: ComisionPreviousProps) {

    const { setShowList } = useAdminOptions();
    const { showAlert } = useAlert();
    const { refetch } = useRefetch();
    const [selected, setSelected] = useState('');
    const [activating, setActivating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [data, setData] = useState<DataType[] | []>([]);
    const [loading, setLoading] = useState(false)

    const getComisiones = async () => {
        try {
            setLoading(true);
            const res = await getAll();

            if (res.status !== 200) {
                const alertMessage = `Error al obtener datos: ${res.statusText}`;
                showAlert(alertMessage);
                return;
            }

            setData(res.data);
            return;

        } catch (err) {
            const alertMessage = axios.isAxiosError(err)
                ? `Error al obtener datos: ${err.response?.data?.error || err.message}`
                : 'Error al obtener datos: Error desconocido';
            
            showAlert(alertMessage);
        } finally {
            setLoading(false);
        }
    }

    const activate = async (comisionId: string) => {
        try {
            setActivating(true);
            const res = await selectComisionToShow(comisionId);

            if (res.status !== 200) {
                const alertMessage = `Error al seleccionar comisión: ${res.statusText}`;
                showAlert(alertMessage);
                return;
            }

            const alertMessage = 'La comisión ha sido seleccionada como "activa" y se mostrará en la página web';
            showAlert(alertMessage);
            refetch();
            setSelected('');
            return;

        } catch (err) {
            const alertMessage = axios.isAxiosError(err)
                ? `Error al seleccionar comisión: ${err.response?.data?.error || err.message}`
                : 'Error al seleccionar comisión: Error desconocido';
            
            showAlert(alertMessage);
        } finally {
            setActivating(false);
        }
    }

    const delComision = async (comisionId: string) => {
        try {
            setDeleting(true);
            const res = await deleteComision(comisionId);

            if (res.status !== 200) {
                const alertMessage = `Error al eliminar comisión: ${res.statusText}`;
                showAlert(alertMessage);
                return;
            }

            const alertMessage = 'La comisión seleccionada ha sido eliminada';
            showAlert(alertMessage);
            refetch();
            setSelected('');
            return;

        } catch (err) {
            const alertMessage = axios.isAxiosError(err)
                ? `Error al eliminar comisión: ${err.response?.data?.error || err.message}`
                : 'Error al eliminar comisión: Error desconocido';
            
            showAlert(alertMessage);
        } finally {
            setDeleting(false);
        }
    }

    useEffect(() => {
        if (!activating && !deleting) {
            getComisiones()
        }
        
    }, [activating, deleting])

    return (
        <section
            className='fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex flex-col justify-start overflow-y-auto scrollbar-hide px-4'>
            
            <CloseButton
                action={() => {
                    setShowForm('')
                    setShowList(false)
                }}/>

            <motion.div
                className="rounded-md shadow-sm shadow-gray-400 border-black border-2 w-full max-w-[400px] md:max-w-md mx-auto relative my-10 sm:my-4"
                initial={{ y: 30, opacity: 0 }}
                transition={{ duration: 0.8 }}
                whileInView={{ y: 0, opacity: 1 }}>
                <h2 className="bg-black text-xl text-center text-white font-bold p-4 py-6">Seleccioná una lista</h2>
                <div className='flex flex-col text-black p-4 bg-gray-50 rounded-b-md'>
                    
                    {(!loading && data.length > 0) &&
                        (data.map(comision => 
                            <article
                                key={comision.id}
                                onClick={() => setSelected(comision.id)}
                                className={`text-sm md:text-lg border border-gray-500 p-4 rounded-md font-extralight cursor-pointer mb-2 relative ${selected === comision.id && 'bg-cyan-200'}`}>
                                <h3 className="text-right mb-2 text-sm">{`Creada el ${formatUTCDate(comision.created_at)}`}</h3>
                                <ul>
                                    <li>
                                        Período:
                                        <span className="font-medium">
                                        {comision.toDate ?
                                            ` ${dateToShow(comision.fromDate)} al ${dateToShow(comision.toDate)}` : ` desde ${dateToShow(comision.fromDate)}`}
                                        </span>
                                    </li>
                                    <li>
                                        Presidente: <span className="font-medium">
                                            {comision.presidente}
                                        </span>
                                    </li>
                                    <li>
                                        Vicepresidente: <span className="font-medium"> 
                                            {comision.vicepresidente}
                                        </span>
                                    </li>
                                    <AnimatePresence>
                                    {selected === comision.id &&
                                        <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}>
                                        <li>
                                        Secretario: <span className="font-medium"> 
                                            {comision.secretario}
                                        </span>
                                        </li>
                                        <li>
                                        Prosecretario: <span className="font-medium"> 
                                            {comision.prosecretario}
                                        </span>
                                        </li>
                                        <li>
                                        Tesorero: <span className="font-medium"> 
                                            {comision.tesorero}
                                        </span>
                                        </li>
                                        <li>
                                        Protesorero: <span className="font-medium"> 
                                            {comision.protesorero}
                                        </span>
                                        </li>
                                        <li>
                                        Vocales Titulares: <ul className="font-medium ml-4">
                                                {comision.vocalesTitulares.map(vocal => (<li>
                                                    {vocal}
                                            </li>))}
                                        </ul>
                                        </li>
                                        <li>
                                        Vocales Suplentes: <ul className="font-medium ml-4">
                                                {comision.vocalesSuplentes.map(vocal => (<li>
                                                    {vocal}
                                            </li>))}
                                        </ul>
                                        </li>
                                        <li>
                                        Revisores de Cuentas: <ul className="font-medium ml-4">
                                                {comision.revisoresDeCuentas.map(revisor => (<li>
                                                    {revisor}
                                            </li>))}
                                        </ul>
                                        </li>
                                        </motion.div>
                                        }
                                    </AnimatePresence>
                                </ul>
                                <AnimatePresence>
                                {selected === comision.id &&
                                        <motion.article className='flex justify-center mt-6 md:mt-8 gap-2'
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}>
                                    
                                        <MainButton
                                            type='button'
                                            text={deleting ? <><span>Eliminando </span><i className="fa-solid fa-spinner fa-spin"></i></> : 'Eliminar'}
                                            disabled={deleting}
                                            addClass='w-full rounded-md'
                                            forDelete={true}
                                            action={() => delComision(comision.id)}/>
                                        {comision.selectedToShow === 0 &&
                                        <MainButton
                                            type='button'
                                            text={activating ? <><span>Activando </span><i className="fa-solid fa-spinner fa-spin"></i></> : 'Activar'}
                                            disabled={activating}
                                            addClass='w-full rounded-md'
                                            action={() => activate(comision.id)}    />}
                                    </motion.article>}
                                    </AnimatePresence>
                            </article>
                        ))}
                </div>
            </motion.div>
        </section>
    )
}