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
    showForm: 'previous'|'update'|'new' |''
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

export default function ComisionNew({showForm, setShowForm}: ComisionNewProps) {

    const { showAlert } = useAlert();
    const { refetch } = useRefetch();
    const { setShowList } = useAdminOptions();
    const [sendingNewList, setSendingNewList] = useState(false);
    const [showDataToSend, setShowDataToSend] = useState(false);
    const [dataToSend, setDataToSend] = useState<NewComisionData>({} as NewComisionData)

    const validationSchema = Yup.object({
        fromDate: Yup
            .date()
            .required('La fecha de inicio es obligatoria')
            .typeError('Ingresa una fecha válida'),
        toDate: Yup
            .date()
            .optional()
            .nullable()
            .transform((value, originalValue) => {return originalValue === '' ? null : value})
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

    const onSubmit = (data: FormData) => {
        
        setDataToSend({
            ...data,
            fromDate: formatDate(data.fromDate),
            toDate: (data.toDate && data.toDate.toString() !== '') ? formatDate(data.toDate) : null,
            vocalesTitulares: data.vocalesTitulares.split(',').map(n => n.trim()),
            vocalesSuplentes: data.vocalesSuplentes.split(',').map(n => n.trim()),
            revisoresDeCuentas: data.revisoresDeCuentas.split(',').map(n => n.trim())
        });

        setShowDataToSend(true)
    }

    const sendData = async (data: NewComisionData) => {

        try {
            setSendingNewList(true);
            const res = await newComision(data);
        
            if (res.status !== 200) {
                const alertMessage = `Error al enviar datos: ${res.statusText}`;
                showAlert(alertMessage);
                return;
            };
        
            reset();
            refetch();
            setShowDataToSend(false);
            setShowForm('');
            setDataToSend({} as NewComisionData);
            setShowList(false);
            
            const alertMessage = 'Nueva comisión ingresada con éxito';
            showAlert(alertMessage);
            return;
        
        } catch (err) {
            const alertMessage = axios.isAxiosError(err)
                ? `Error al enviar datos: ${err.response?.data?.error || err.message}`
                : 'Error al enviar datos: Error desconocido';
            showAlert(alertMessage);
            return;
        } finally {
            setSendingNewList(false);
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
                className="rounded-md shadow-sm shadow-gray-400 border-black border-2 w-full max-w-[400px] md:max-w-md mx-auto relative my-10 sm:my-4"
                initial={{ y: 30, opacity: 0 }}
                transition={{ duration: 0.8 }}
                whileInView={{ y: 0, opacity: 1 }}>
                <h2 className="bg-black text-xl text-center text-white font-bold p-4 py-6">Ingreso de nueva comisión</h2>
                {(showDataToSend && Object.keys(dataToSend).length !== 0 ) ?
                    <div className='flex flex-col text-black p-4 bg-gray-50 rounded-b-md'>
                        <h3 className='mb-3 text-center font-semibold'>Se enviarán los siguientes datos:</h3>

                        <ul>
                            <li className='mb-1.5'>
                                Fecha de inicio:
                                <span className='font-bold'> {dataToSend['fromDate']}</span>
                            </li>
                            <li className='mb-1.5'>
                                Fecha de finalización:
                                <span className='font-bold'> {dataToSend['toDate']}</span>
                            </li>
                            <li className='mb-1.5'>
                                Presidente:
                                <span className='font-bold'> {dataToSend['presidente']}</span>
                            </li>
                            <li className='mb-1.5'>
                                Vicepresidente:
                                <span className='font-bold'> {dataToSend['vicepresidente']}</span>
                            </li>
                            <li className='mb-1.5'>
                                Secretario:
                                <span className='font-bold'> {dataToSend['secretario']}</span>
                            </li>
                            <li className='mb-1.5'>
                                Prosecretario:
                                <span className='font-bold'> {dataToSend['prosecretario']}</span>
                            </li>
                            <li className='mb-1.5'>
                                Tesorero:
                                <span className='font-bold'> {dataToSend['tesorero']}</span>
                            </li>
                            <li className='mb-1.5'>
                                Protesorero:
                                <span className='font-bold'> {dataToSend['protesorero']}</span>
                            </li>
                            <li className='mb-1.5'>
                                Vocales titulares:
                                <ul className='font-bold pl-4'>
                                    {dataToSend['vocalesTitulares'].map(vocal =>
                                        (<li key={vocal}>{vocal}</li>))}
                                </ul>
                            </li>
                            <li className='mb-1.5'>
                                Vocales suplentes:
                                <ul className='font-bold pl-4'>
                                    {dataToSend['vocalesSuplentes'].map(vocal =>
                                        (<li key={vocal}>{vocal}</li>))}
                                </ul>
                            </li>
                            <li className='mb-1.5'>
                                Revisores de cuentas:
                                <ul className='font-bold pl-4'>
                                    {dataToSend['revisoresDeCuentas'].map(revisor =>
                                        (<li key={revisor}>{revisor}</li>))}
                                </ul>
                            </li>
                        </ul>

                        <article className='flex justify-center mt-6 md:mt-8 gap-2'>
                            <MainButton
                                type='button'
                                text='Atrás'
                                addClass='w-full rounded-md'
                                action={() => setShowDataToSend(false)}
                                secondary={true} />
                            <MainButton
                                type='button'
                                text={sendingNewList ? <><span>Enviando </span><i className="fa-solid fa-spinner fa-spin"></i></> : 'Confirmar'}
                                addClass='w-full rounded-md'
                                disabled={sendingNewList ? true : false}
                                action={() => sendData(dataToSend)}/>
                        </article>
                    </div> :
                    <form
                        className='flex flex-col text-black p-4 bg-gray-50 rounded-b-md'
                        onSubmit={handleSubmit(onSubmit)}>
                        <article className="flex flex-col mb-3">
                            <label
                                className="font-medium text-start"
                                htmlFor="from-date">Fecha de inicio del período</label>
                            <input
                                {...register("fromDate")}
                                id='from-date'
                                className={`bg-gray-200 focus:bg-gray-300 border border-black rounded-md px-2 py-1 ${errors.fromDate ? 'border-red-600' : ''}`}
                                type="date" />
                            {errors.fromDate && <InputError errorMessage={errors.fromDate.message || ''} />}
                        </article>
                        <article className="flex flex-col mb-3">
                            <label
                                className="font-medium text-start"
                                htmlFor="to-date">Fecha de finalización del período <span className='font-light'>(opcional)</span></label>
                            <input
                                {...register("toDate")}
                                id='to-date'
                                className={`bg-gray-200 focus:bg-gray-300 border border-black rounded-md px-2 py-1 ${errors.toDate ? 'border-red-600' : ''}`}
                                type="date" />
                            {errors.toDate && <InputError errorMessage={errors.toDate.message || ''} />}
                        </article>
                        <article className="flex flex-col mb-3">
                            <label
                                className="font-medium text-start"
                                htmlFor="Presidente">Presidente</label>
                            <input
                                {...register("presidente")}
                                id='Presidente'
                                className={`bg-gray-200 focus:bg-gray-300 border border-black rounded-md px-2 py-1 ${errors.presidente ? 'border-red-600' : ''}`}
                                type="text" />
                            {errors.presidente && <InputError errorMessage={errors.presidente.message || ''} />}
                        </article>
                        <article className="flex flex-col mb-3">
                            <label
                                className="font-medium text-start"
                                htmlFor="Vicepresidente">Vicepresidente</label>
                            <input
                                {...register("vicepresidente")}
                                id='Vicepresidente'
                                className={`bg-gray-200 focus:bg-gray-300 border border-black rounded-md px-2 py-1 ${errors.vicepresidente ? 'border-red-600' : ''}`}
                                type="text" />
                            {errors.vicepresidente && <InputError errorMessage={errors.vicepresidente.message || ''} />}
                        </article>

                        <article className="flex flex-col mb-3">
                            <label
                                className="font-medium text-start"
                                htmlFor="Secretario">Secretario</label>
                            <input
                                {...register("secretario")}
                                id='Secretario'
                                className={`bg-gray-200 focus:bg-gray-300 border border-black rounded-md px-2 py-1 ${errors.secretario ? 'border-red-600' : ''}`}
                                type="text" />
                            {errors.secretario && <InputError errorMessage={errors.secretario.message || ''} />}
                        </article>

                        <article className="flex flex-col mb-3">
                            <label
                                className="font-medium text-start"
                                htmlFor="Prosecretario">Prosecretario</label>
                            <input
                                {...register("prosecretario")}
                                id='Prosecretario'
                                className={`bg-gray-200 focus:bg-gray-300 border border-black rounded-md px-2 py-1 ${errors.prosecretario ? 'border-red-600' : ''}`}
                                type="text" />
                            {errors.prosecretario && <InputError errorMessage={errors.prosecretario.message || ''} />}
                        </article>

                        <article className="flex flex-col mb-3">
                            <label
                                className="font-medium text-start"
                                htmlFor="Tesorero">Tesorero</label>
                            <input
                                {...register("tesorero")}
                                id='Tesorero'
                                className={`bg-gray-200 focus:bg-gray-300 border border-black rounded-md px-2 py-1 ${errors.tesorero ? 'border-red-600' : ''}`}
                                type="text" />
                            {errors.tesorero && <InputError errorMessage={errors.tesorero.message || ''} />}
                        </article>

                        <article className="flex flex-col mb-3">
                            <label
                                className="font-medium text-start"
                                htmlFor="Protesorero">Protesorero</label>
                            <input
                                {...register("protesorero")}
                                id='Protesorero'
                                className={`bg-gray-200 focus:bg-gray-300 border border-black rounded-md px-2 py-1 ${errors.protesorero ? 'border-red-600' : ''}`}
                                type="text" />
                            {errors.protesorero && <InputError errorMessage={errors.protesorero.message || ''} />}
                        </article>

                        <article className="flex flex-col mb-3">
                            <label
                                className="font-medium text-start"
                                htmlFor="vocales-titulares">Vocales Titulares <span className='font-light'>(nombres separados por comas)</span></label>
                            <input
                                {...register("vocalesTitulares")}
                                id='vocales-titulares'
                                className={`bg-gray-200 focus:bg-gray-300 border border-black rounded-md px-2 py-1 ${errors.vocalesTitulares ? 'border-red-600' : ''}`}
                                type="text"
                                placeholder='ej: Juan Pérez, Estela González, José Sánchez' />
                            {errors.vocalesTitulares && <InputError errorMessage={errors.vocalesTitulares.message || ''} />}
                        </article>

                        <article className="flex flex-col mb-3">
                            <label
                                className="font-medium text-start"
                                htmlFor="vocales-suplentes">Vocales Suplentes <span className='font-light'>(nombres separados por comas)</span></label>
                            <input
                                {...register("vocalesSuplentes")}
                                id='vocales-suplentes'
                                className={`bg-gray-200 focus:bg-gray-300 border border-black rounded-md px-2 py-1 ${errors.vocalesSuplentes ? 'border-red-600' : ''}`}
                                type="text"
                                placeholder='ej: Juan Pérez, Estela González, José Sánchez' />
                            {errors.vocalesSuplentes && <InputError errorMessage={errors.vocalesSuplentes.message || ''} />}
                        </article>

                        <article className="flex flex-col mb-3">
                            <label
                                className="font-medium text-start"
                                htmlFor="revisores-de-cuentas">Revisores de Cuentas <span className='font-light'>(nombres separados por comas)</span></label>
                            <input
                                {...register("revisoresDeCuentas")}
                                id='revisores-de-cuentas'
                                className={`bg-gray-200 focus:bg-gray-300 border border-black rounded-md px-2 py-1 ${errors.revisoresDeCuentas ? 'border-red-600' : ''}`}
                                type="text"
                                placeholder='ej: Juan Pérez, Estela González, José Sánchez' />
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
                                text='Enviar'
                                addClass='w-full rounded-md' />
                        </article>
                    </form>}
            </motion.div>

        </section>
    )
}