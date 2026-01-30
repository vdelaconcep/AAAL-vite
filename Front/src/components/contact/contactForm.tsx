
import MainButton from "@/components/buttons/mainButton";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import InputError from "@/components/ui/inputError";
import type { FormDataType } from "@/components/contact/contactComponent";
import { useEffect } from "react";

interface ContactFormProps {
    onSubmit: (arg: FormDataType) => void
    messageStatus: '' | 'sent' | 'sending'
}

export default function ContactForm({onSubmit, messageStatus}: ContactFormProps) {

    const validationSchema: Yup.ObjectSchema<FormDataType> = Yup.object({
        name: Yup.string()
            .min(3, "El nombre debe tener más de 3 caracteres")
            .max(50, "El nombre no puede tener más de 50 caracteres")
            .required("Ingresá tu nombre"),
        email: Yup.string()
            .email("Debe ingresar un e-mail válido")
            .max(50, "El e-mail no puede tener más de 50 caracteres")
            .required("Ingresá tu dirección de e-mail"),
        phone: Yup.string()
            .optional()
            .matches(/^[0-9]*$/, "Solo se permiten números")
            .test(
                "len",
                "El teléfono debe tener entre 8 y 15 dígitos",
                value => !value || (value.length >= 8 && value.length <= 15)
            ),
        subject: Yup.string()
            .max(50, "El asunto no puede tener más de 50 caracteres")
            .required("Ingresá un asunto"),
        message: Yup.string()
            .min(10, "El mensaje debe tener al menos 10 caracteres")
            .max(500, "El mensaje no puede tener más de 500 caracteres")
            .required("El mensaje no puede quedar vacío")
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormDataType>({
        resolver: yupResolver(validationSchema)
    });

    useEffect(() => {
        if (messageStatus === 'sent') reset()
    }, [messageStatus])
    
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-linear-to-tr from-[#A0AB94] to-[#8b9582] px-3 py-3 rounded-xl shadow-md shadow-gray-800 text-md w-full md:max-w-[400px] mb-4">
            <article className="flex flex-col mb-2">
                <label
                    className="text-white ml-1 mb-1"
                    htmlFor="name">Nombre:</label>
                <input
                    {...register("name")}
                    className={`bg-[#bac7ad] focus:bg-amber-50  border rounded-md px-2 py-1 ${errors.name ? 'border-red-600' : 'border-[#858f7b]'}`}
                    type="text" />
                {errors.name && <InputError errorMessage={errors.name.message || ''} />}
            </article>
            <article className="flex flex-col mb-2">
                <label
                    className="text-white ml-1 mb-1"
                    htmlFor="email">E-mail:</label>
                <input
                    {...register("email")}
                    className={`bg-[#bac7ad] focus:bg-amber-50  border rounded-md px-2 py-1 ${errors.email ? 'border-red-600' : 'border-[#858f7b]'}`}
                    type="email" />
                {errors.email && <InputError errorMessage={errors.email.message || ''} />}
            </article>
            <article className="flex flex-col mb-2">
                <label
                    className="text-white ml-1 mb-1"
                    htmlFor="phone">Teléfono (opcional):</label>
                <input
                    {...register("phone")}
                    className={`bg-[#bac7ad] focus:bg-amber-50  border rounded-md px-2 py-1 ${errors.phone ? 'border-red-600' : 'border-[#858f7b]'}`}
                    type="tel" />
                {errors.phone && <InputError errorMessage={errors.phone.message || ''} />}
            </article>
            <article className="flex flex-col mb-2">
                <label
                    className="text-white ml-1 mb-1"
                    htmlFor="subject">Asunto:</label>
                <input
                    {...register("subject")}
                    className={`bg-[#bac7ad] focus:bg-amber-50  border rounded-md px-2 py-1 ${errors.subject ? 'border-red-600' : 'border-[#858f7b]'}`}
                    type="text" />
                {errors.subject && <InputError errorMessage={errors.subject.message || ''} />}
            </article>
            <article className="flex flex-col mb-4">
                <label
                    className="text-white ml-1 mb-1"
                    htmlFor="message">Mensaje:</label>
                <textarea
                    {...register("message")}
                    className={`bg-[#bac7ad] focus:bg-amber-50  border rounded-md px-2 py-1 h-[120px] ${errors.message ? 'border-red-600' : 'border-[#858f7b]'}`} />
                {errors.message && <InputError errorMessage={errors.message.message || ''} />}
            </article>
            <article className="flex gap-2">
                <MainButton
                    type='reset'
                    text='Cancelar'
                    addClass='w-1/2 rounded-lg'
                    action={() => reset()}
                    secondary= {true}/>
                <MainButton
                    type='submit'
                    text={messageStatus === 'sending' ? <><span>Enviando </span><i className="fa-solid fa-spinner fa-spin"></i></> : 'Enviar'}
                    addClass='w-1/2 rounded-lg'
                    disabled={messageStatus === 'sending' || messageStatus === 'sent'} />
            </article>
        </form>
    )
}