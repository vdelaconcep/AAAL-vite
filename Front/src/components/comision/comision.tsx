import { getSelected } from "@/services/comisionServices";
import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useAlert } from "@/context/alertContext";
import CommitteeMembersCard from "@/components/comision/committeeMemberCard";
import LoadingComponent from "@/components/ui/loadingComponent";
import axios from 'axios';

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
    

    return (
        <main className="h-full bg-white py-7 md:py-10 flex flex-col items-center px-4">
            <div className="text-gray-900 text-center font-bold italic mb-5">
                <h1 className="text-2xl md:text-3xl mb-2 md:mb-4">Comisión directiva</h1>
                {(Object.keys(comision).length > 0) && <h3 className="text-s md:text-lg">{`Período ${comision.periodo} - ${comision.periodo + 1}`}</h3>}
            </div>
            
            <LoadingComponent isLoading={loading} />

            {(Object.keys(comision).length > 0) ? (
                
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="flex flex-col w-full md:max-w-[450px] items-center text-[13px] md:text-[16px]">
                    <div className="w-full mb-4">
                        <CommitteeMembersCard
                            position='Presidente'
                            members={[data.presidente]} />
                    </div>
                    <div className="w-full mb-4">
                        <MiembroComision
                            fondo='#6B9795' // Celeste
                            cargo='Vicepresidente'
                            nombres={[data.vicepresidente]} />
                    </div>
                    <div className="flex gap-2 mb-4 w-full">
                        <MiembroComision
                            fondo='#A0AB94' // Verde
                            cargo='Secretario'
                            nombres={[comision.secretario]} />
                        <MiembroComision
                            fondo='#A0AB94' // Verde
                            cargo='Prosecretario'
                            nombres={[comision.prosecretario]} />
                    </div>
                    <div className="flex gap-2 mb-4 w-full">
                        <MiembroComision
                            fondo='#6B9795' // Celeste
                            cargo='Tesorero'
                            nombres={[comision.tesorero]} />
                        <MiembroComision
                            fondo='#6B9795' // Celeste
                            cargo='Protesorero'
                            nombres={[comision.protesorero]} />
                    </div>
                    <div className="flex gap-2 mb-4 w-full">
                        <MiembroComision
                            fondo='#A0AB94' // Verde
                            cargo='Vocales titulares'
                            nombres={[comision.vocaltitular1, comision.vocaltitular2, comision.vocaltitular3]} />
                        <MiembroComision
                            fondo='#A0AB94' // Verde
                            cargo='Vocales suplentes'
                            nombres={[comision.vocalsuplente1, comision.vocalsuplente2, comision.vocalsuplente3]} />
                    </div>
                    <div className="flex gap-2 mb-4 w-full">
                    <MiembroComision
                        fondo='#6B9795' // Celeste
                        cargo='Revisores de cuentas'
                        nombres={[comision.revisordecuentas1, comision.revisordecuentas2, comision.revisordecuentas3]} />
                    </div>
                </motion.div>
            ) : (
                !cargando && <p>No hay datos de comisión disponibles</p>
            )}
        </main>
    )
};