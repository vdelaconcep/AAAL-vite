import { getSelected } from "@/services/comisionServices";
import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useAlert } from "@/context/alertContext";
import ComisionMemberCard from "@/components/comision/comisionMemberCard";
import LoadingComponent from "@/components/ui/loadingComponent";
import axios from 'axios';
import AdminOptionsComponent from "@/components/adminOptions/adminOptionsComponent";
import AdminOptionsList from "@/components/adminOptions/adminOptionsList";
import ComisionAdminOptionsList from "@/components/comision/admin/comisionAdminOptionsList";
import { RefetchProvider } from "@/context/refetchContext";
import { AdminOptionsProvider } from "@/context/adminOptionsContext";


export default function ComisionComponent() {

    const { showAlert } = useAlert();

    const [data, setData] = useState<{
        fromDate: string,
        toDate?: string,
        presidente: string,
        vicepresidente: string,
        secretario: string,
        prosecretario: string,
        tesorero: string,
        protesorero: string,
        vocalesTitulares: string[],
        vocalesSuplentes: string[],
        revisoresDeCuentas: string[],
        created_at: string
    }>({
        fromDate: '',
        toDate: '',
        presidente: '',
        vicepresidente: '',
        secretario: '',
        prosecretario: '',
        tesorero: '',
        protesorero: '',
        vocalesTitulares: [],
        vocalesSuplentes: [],
        revisoresDeCuentas: [],
        created_at: ''
    });
    
    const [loading, setLoading] = useState(false);

    const getList = async () => {
        try {
            setLoading(true);
            const res = await getSelected();

            if (res.status !== 200) {
                const alertMessage = `Error al obtener los datos: ${res.statusText}`;
                showAlert(alertMessage);
                return;
            }

            setData(res.data[0]);
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

    useEffect(() => {
        getList()
    }, []);
    
    const dateToShow = (date: string) => {
        return `${date.slice(8,10)}-${date.slice(5,7)}-${date.slice(0,4)}`
    }

    return (
        <main className="h-full bg-white py-7 md:py-10 flex flex-col items-center px-4 relative">
            <RefetchProvider onRefetch={getList}>
                <AdminOptionsProvider>
                    <AdminOptionsComponent>
                        <AdminOptionsList
                            title="Comisión Directiva"
                            list={<ComisionAdminOptionsList />}/>

                        </AdminOptionsComponent>
                </AdminOptionsProvider>
            </RefetchProvider>

            <div className="text-gray-900 text-center font-bold italic mb-5">
                <h1 className="text-2xl md:text-3xl mb-2 md:mb-4">Comisión directiva</h1>
                {(Object.keys(data).length > 0) && <h3 className="text-s md:text-lg">{data.toDate ? '' : 'Desde '}{dateToShow(data.fromDate)}{data.toDate ? ` // ${dateToShow(data.toDate)}` : ''}</h3>}
            </div>
            
            <LoadingComponent isLoading={loading} />

            {(Object.keys(data).length > 0) ? (
                
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="flex flex-col w-full md:max-w-[450px] items-center text-[13px] md:text-[16px]">
                    <div className="w-full mb-4">
                        <ComisionMemberCard
                            position='Presidente'
                            members={[data.presidente]} />
                    </div>
                    <div className="w-full mb-4">
                        <ComisionMemberCard
                            position='Vicepresidente'
                            members={[data.vicepresidente]} />
                    </div>
                    <div className="flex gap-2 mb-4 w-full">
                        <ComisionMemberCard
                            position='Secretario'
                            members={[data.secretario]} />
                        <ComisionMemberCard
                            position='Prosecretario'
                            members={[data.prosecretario]} />
                    </div>
                    <div className="flex gap-2 mb-4 w-full">
                        <ComisionMemberCard
                            position='Tesorero'
                            members={[data.tesorero]} />
                        <ComisionMemberCard
                            position='Protesorero'
                            members={[data.protesorero]} />
                    </div>
                    <div className="flex gap-2 mb-4 w-full">
                        <ComisionMemberCard
                            position='Vocales Titulares'
                            members={data.vocalesTitulares} />
                        <ComisionMemberCard
                            position='Vocales Suplentes'
                            members={data.vocalesSuplentes} />
                    </div>
                    <div className="flex gap-2 mb-4 w-full">
                        <ComisionMemberCard
                            position='Revisores de Cuentas'
                            members={data.revisoresDeCuentas} />
                    </div>
                </motion.div>
            ) : (
                !loading && <p>No hay datos de comisión disponibles</p>
            )}
        </main>
    )
};