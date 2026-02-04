import { useState } from 'react';
import MainButton from '@/components/buttons/mainButton';
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import InputError from '@/components/ui/inputError';
import { useAlert } from '@/context/alertContext';
import { X } from 'lucide-react';
import { newComision } from '@/services/comisionServices';
import axios from 'axios';
import { useRefetch } from '@/context/refetchContext';
import { useAdminOptions } from '@/context/adminOptionsContext';

interface ComisionNewProps {
    setShowForm: (form: 'previous'|'update'|'new' |'') => void
}

type FormData = {
    fromDate: Date;
    toDate?: Date | null;
    presidente: string;
    vicepresidente: string;
    secretario: string;
    prosecretario: string;
    tesorero: string;
    protesorero: string;
    vocalesTitulares: string;
    vocalesSuplentes: string;
    revisoresDeCuentas: string;
}

type NewComisionData = {
    fromDate: string;
    toDate?: string | null;
    presidente: string;
    vicepresidente: string;
    secretario: string;
    prosecretario: string;
    tesorero: string;
    protesorero: string;
    vocalesTitulares: string[];
    vocalesSuplentes: string[];
    revisoresDeCuentas: string[];
}

export default function ComisionNew({setShowForm}: ComisionNewProps) {

    const { showAlert } = useAlert();
    const { refetch } = useRefetch();
    const { setShowList } = useAdminOptions();
    const [sendingNewList, setSendingNewList] = useState(false);

    const validationSchema = Yup.object({
        fromDate: Yup
            .date()
            .required('La fecha de inicio es obligatoria')
            .typeError('Ingresa una fecha válida'),
        toDate: Yup
            .date()
            .optional()
            .min(
            Yup.ref('fromDate'),
            'Debe ser posterior a la fecha de inicio')
            .typeError('Ingresa una fecha válida'),
        presidente: Yup
            .string()
            .required('El presidente es obligatorio')
            .trim()
            .min(3, 'El nombre debe tener al menos 3 caracteres')
            .max(50, 'El nombre no puede superar los 50 caracteres'),
        vicepresidente: Yup
            .string()
            .required('El vicepresidente es obligatorio')
            .trim()
            .min(3, 'El nombre debe tener al menos 3 caracteres')
            .max(50, 'El nombre no puede superar los 50 caracteres'),
        secretario: Yup
            .string()
            .required('El secretario es obligatorio')
            .trim()
            .min(3, 'El nombre debe tener al menos 3 caracteres')
            .max(50, 'El nombre no puede superar los 50 caracteres'),
        prosecretario: Yup
            .string()
            .required('El prosecretario es obligatorio')
            .trim()
            .min(3, 'El nombre debe tener al menos 3 caracteres')
            .max(50, 'El nombre no puede superar los 50 caracteres'),
        tesorero: Yup
            .string()
            .required('El tesorero es obligatorio')
            .trim()
            .min(3, 'El nombre debe tener al menos 3 caracteres')
            .max(50, 'El nombre no puede superar los 50 caracteres'),
        protesorero: Yup
            .string()
            .required('El protesorero es obligatorio')
            .trim()
            .min(3, 'El nombre debe tener al menos 3 caracteres')
            .max(50, 'El nombre no puede superar los 50 caracteres'),
        vocalesTitulares: Yup
            .string()
            .required('Los vocales titulares son obligatorios')
            .trim()
            .test('validar-nombres', 'Cada nombre debe tener entre 3 y 50 caracteres', (value) => {
            if (!value) return false;
            const nombres = value.split(',').map(n => n.trim()).filter(n => n.length > 0);
            return nombres.every(nombre => nombre.length >= 3 && nombre.length <= 50);
            }),
        vocalesSuplentes: Yup
            .string()
            .required('Los vocales suplentes son obligatorios')
            .trim()
            .test('validar-nombres', 'Cada nombre debe tener entre 3 y 50 caracteres', (value) => {
            if (!value) return false;
            const nombres = value.split(',').map(n => n.trim()).filter(n => n.length > 0);
            return nombres.every(nombre => nombre.length >= 3 && nombre.length <= 50);
            }),
        revisoresDeCuentas: Yup
            .string()
            .required('Los revisores de cuentas son obligatorios')
            .trim()
            .test('validar-nombres', 'Cada nombre debe tener entre 3 y 50 caracteres', (value) => {
            if (!value) return false;
            const nombres = value.split(',').map(n => n.trim()).filter(n => n.length > 0);
            return nombres.every(nombre => nombre.length >= 3 && nombre.length <= 50);
            })
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
    };

    const onSubmit = async (data: FormData) => {
        
        const dataToSend: NewComisionData = {
            ...data,
            fromDate: formatDate(data.fromDate),
            toDate: data.toDate ? formatDate(data.toDate) : null,
            vocalesTitulares: data.vocalesTitulares.split(',').map(n => n.trim()),
            vocalesSuplentes: data.vocalesSuplentes.split(',').map(n => n.trim()),
            revisoresDeCuentas: data.revisoresDeCuentas.split(',').map(n => n.trim())
        };
        try {
            setSendingNewList(true);
            const res = await newComision(dataToSend);
        
            if (res.status !== 200) {
                const alertMessage = `Error al enviar datos: ${res.statusText}`;
                showAlert(alertMessage);
                return;
            };
        
            const alertMessage = 'Nueva comisión ingresada con éxito';
            showAlert(alertMessage, {
                addAction: () => {
                    setShowForm('');
                    setShowList(false)
                }
            });
            reset();
            refetch();
            return;
        
        } catch (err) {
            const alertMessage = axios.isAxiosError(err)
                ? `Error al obtener datos: ${err.response?.data?.error || err.message}`
                : 'Error al obtener datos: Error desconocido';
            showAlert(alertMessage);
            return;
        } finally {
            setSendingNewList(false)
        }
    };

    return (
        <section
            className='fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex flex-col justify-start overflow-y-auto scrollbar-hide px-4'>
            
            <button
                onClick={() => {
                    setShowForm('')
                    setShowList(false)
                }}
                title="Cerrar"
                className="absolute top-2 md:top-4 right-2 md:right-4 text-gray-300 hover:text-white transition-colors z-20 bg-black bg-opacity-50 rounded-full p-2 cursor-pointer"
                aria-label="Cerrar"
            >
                <X size={32} />
            </button>

            <motion.div
                className="rounded-md bg-gray-700 shadow-sm shadow-gray-600 border-black border-2 p-4 w-full max-w-[400px] md:max-w-md mx-auto relative my-10 sm:my-4"
                initial={{ y: 30, opacity: 0 }}
                transition={{ duration: 0.8 }}
                whileInView={{ y: 0, opacity: 1 }}>
                <h2 className="text-xl text-center text-white font-bold mb-4">Ingreso de nueva comisión</h2>
                <form
                    className='flex flex-col text-black'
                    onSubmit={handleSubmit(onSubmit)}>
                    <article className="flex flex-col mb-3">
                        <label
                            className="font-medium text-start text-white"
                            htmlFor="fromDate">Fecha de inicio del período:</label>
                        <input
                            {...register("fromDate")}
                            className={`bg-gray-500 text-white focus:bg-gray-300 focus:text-black border border-black rounded-md px-2 py-1 ${errors.fromDate ? 'border-red-600' : ''}`}
                            type="date" />
                        {errors.fromDate && <InputError errorMessage={errors.fromDate.message || ''} />}
                    </article>
                    <article className="flex flex-col mb-3">
                        <label
                            className="font-medium text-start text-white"
                            htmlFor="toDate">Fecha de finalización del período <span className='font-light'>(opcional)</span>:</label>
                        <input
                            {...register("toDate")}
                            className={`bg-gray-500 text-white focus:bg-gray-300 focus:text-black border border-black rounded-md px-2 py-1 ${errors.toDate ? 'border-red-600' : ''}`}
                            type="date" />
                        {errors.toDate && <InputError errorMessage={errors.toDate.message || ''} />}
                    </article>
                    <article className="flex flex-col mb-3">
                        <label
                            className="font-medium text-start text-white"
                            htmlFor="presidente">Presidente:</label>
                        <input
                            {...register("presidente")}
                            className={`bg-gray-500 text-white focus:bg-gray-300 focus:text-black border border-black rounded-md px-2 py-1 ${errors.presidente ? 'border-red-600' : ''}`}
                            type="text" />
                        {errors.presidente && <InputError errorMessage={errors.presidente.message || ''} />}
                    </article>
                    <article className="flex flex-col mb-3">
                        <label
                            className="font-medium text-start text-white"
                            htmlFor="vicepresidente">Vicepresidente:</label>
                        <input
                            {...register("vicepresidente")}
                            className={`bg-gray-500 text-white focus:bg-gray-300 focus:text-black border border-black rounded-md px-2 py-1 ${errors.vicepresidente ? 'border-red-600' : ''}`}
                            type="text" />
                        {errors.vicepresidente && <InputError errorMessage={errors.vicepresidente.message || ''} />}
                    </article>

                    <article className="flex flex-col mb-3">
                        <label
                            className="font-medium text-start text-white"
                            htmlFor="secretario">Secretario:</label>
                        <input
                            {...register("secretario")}
                            className={`bg-gray-500 text-white focus:bg-gray-300 focus:text-black border border-black rounded-md px-2 py-1 ${errors.secretario ? 'border-red-600' : ''}`}
                            type="text" />
                        {errors.secretario && <InputError errorMessage={errors.secretario.message || ''} />}
                    </article>

                    <article className="flex flex-col mb-3">
                        <label
                            className="font-medium text-start text-white"
                            htmlFor="prosecretario">Prosecretario:</label>
                        <input
                            {...register("prosecretario")}
                            className={`bg-gray-500 text-white focus:bg-gray-300 focus:text-black border border-black rounded-md px-2 py-1 ${errors.prosecretario ? 'border-red-600' : ''}`}
                            type="text" />
                        {errors.prosecretario && <InputError errorMessage={errors.prosecretario.message || ''} />}
                    </article>

                    <article className="flex flex-col mb-3">
                        <label
                            className="font-medium text-start text-white"
                            htmlFor="tesorero">Tesorero:</label>
                        <input
                            {...register("tesorero")}
                            className={`bg-gray-500 text-white focus:bg-gray-300 focus:text-black border border-black rounded-md px-2 py-1 ${errors.tesorero ? 'border-red-600' : ''}`}
                            type="text" />
                        {errors.tesorero && <InputError errorMessage={errors.tesorero.message || ''} />}
                    </article>

                    <article className="flex flex-col mb-3">
                        <label
                            className="font-medium text-start text-white"
                            htmlFor="protesorero">Protesorero:</label>
                        <input
                            {...register("protesorero")}
                            className={`bg-gray-500 text-white focus:bg-gray-300 focus:text-black border border-black rounded-md px-2 py-1 ${errors.protesorero ? 'border-red-600' : ''}`}
                            type="text" />
                        {errors.protesorero && <InputError errorMessage={errors.protesorero.message || ''} />}
                    </article>

                    <article className="flex flex-col mb-3">
                        <label
                            className="font-medium text-start text-white"
                            htmlFor="vocalesTitulares">Vocales Titulares <span className='font-light'>(nombres separados por comas)</span>:</label>
                        <input
                            {...register("vocalesTitulares")}
                            className={`bg-gray-500 text-white focus:bg-gray-300 focus:text-black border border-black rounded-md px-2 py-1 ${errors.vocalesTitulares ? 'border-red-600' : ''}`}
                            type="text"
                            placeholder='ej: Juan Pérez, Estela González, José Sánchez'/>
                        {errors.vocalesTitulares && <InputError errorMessage={errors.vocalesTitulares.message || ''} />}
                    </article>

                    <article className="flex flex-col mb-3">
                        <label
                            className="font-medium text-start text-white"
                            htmlFor="vocalesSuplentes">Vocales Suplentes (nombres separados por comas):</label>
                        <input
                            {...register("vocalesSuplentes")}
                            className={`bg-gray-500 text-white focus:bg-gray-300 focus:text-black border border-black rounded-md px-2 py-1 ${errors.vocalesSuplentes ? 'border-red-600' : ''}`}
                            type="text"
                            placeholder='ej: Juan Pérez, Estela González, José Sánchez'/>
                        {errors.vocalesSuplentes && <InputError errorMessage={errors.vocalesSuplentes.message || ''} />}
                    </article>

                    <article className="flex flex-col mb-3">
                        <label
                            className="font-medium text-start text-white"
                            htmlFor="revisoresDeCuentas">Revisores de Cuentas (nombres separados por comas):</label>
                        <input
                            {...register("revisoresDeCuentas")}
                            className={`bg-gray-500 text-white focus:bg-gray-300 focus:text-black border border-black rounded-md px-2 py-1 ${errors.revisoresDeCuentas ? 'border-red-600' : ''}`}
                            type="text"
                            placeholder='ej: Juan Pérez, Estela González, José Sánchez'/>
                        {errors.revisoresDeCuentas && <InputError errorMessage={errors.revisoresDeCuentas.message || ''} />}
                    </article>
                    <article className='flex justify-center mt-6 md:mt-8 gap-2'>
                        <MainButton
                            type='button'
                            text='Cancelar'
                            addClass='w-full rounded-md'
                            action={() => {
                                setShowForm('');
                                reset();
                                setShowList(false)
                            }}
                            secondary={true} />
                        <MainButton
                            type='submit'
                            text={sendingNewList ? <><span>Enviando </span><i className="fa-solid fa-spinner fa-spin"></i></> : 'Enviar'}
                            addClass='w-full rounded-md'
                            disabled={sendingNewList ? true : false}/>
                    </article>
                </form>
            </motion.div>

        </section>
    )
}