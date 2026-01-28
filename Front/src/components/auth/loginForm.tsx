import { useState, type Ref } from 'react';
import MainButton from '@/components/buttons/mainButton';
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import InputError from '@/components/ui/inputError';
import { useAlert } from '@/context/alertContext';
import ShowPasswordButton from '@/components/auth/showPasswordButton';

interface LoginFormProps {
    setShowLoginForm: (arg: boolean) => void
    ref: Ref<HTMLDivElement | null>
}

export default function LoginForm({setShowLoginForm, ref}: LoginFormProps) {

    const { showAlert } = useAlert();
    const [loginInProcess, setLoginInProcess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validationSchema = Yup.object({
        email: Yup.string()
            .max(50, "El e-mail ingresado debe ser más corto")
            .required("Ingrese el e-mail"),
        password: Yup.string()
            .max(50, "La contraseña ingresada debe ser más corta")
            .required("Ingrese la contraseña")
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = (data: {email: string, password: string}) => {
        setLoginInProcess(true);
        showAlert('Función aún no disponible');
        console.log(data);
        reset();
        setLoginInProcess(false);
        setShowLoginForm(false);
    };

    return (
        <section
            className='fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center px-2'>
            <motion.div
                className="bg-gray-300 p-4 rounded-lg shadow-md shadow-gray-500 border-2 border-[#6E1538] w-full sm:max-w-sm mx-auto relative"
                ref={ref}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1, transition: { duration: 0.4 } }}>
                <h2 className="text-xl text-center text-gray-900 font-bold mb-4">Inicie sesión como administrador</h2>
                <form
                    className='flex flex-col text-black'
                    onSubmit={handleSubmit(onSubmit)}>
                    <article className="flex flex-col mb-2">
                        <label
                            className="font-medium text-start"
                            htmlFor="email">E-mail:</label>
                        <input
                            {...register("email")}
                            className={`bg-amber-50 focus:bg-white border rounded-md px-2 py-1 ${errors.email ? 'border-red-600' : ''}`}
                            type="text" />
                        {errors.email && <InputError errorMessage={errors.email.message || ''} />}
                    </article>
                    <article className="flex flex-col mb-2 ">
                        <label
                            className="font-medium text-start"
                            htmlFor="password">Contraseña:</label>
                        <div className='relative w-full'>
                            <input
                            {...register("password")}
                            className={`bg-amber-50 focus:bg-white w-full border rounded-md px-2 py-1 ${errors.password ? 'border-red-600' : ''}`}
                            type={showPassword ? "text" : "password"} />
                        
                        <ShowPasswordButton
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            addClass='absolute right-1 top-1/2 -translate-y-1/2'
                        />
                        </div>
                        {errors.password && <InputError errorMessage={errors.password.message || ''} />}
                        
                    </article>
                    <article className='flex justify-center mt-6 md:mt-8 gap-2'>
                        <MainButton
                            type='button'
                            text='Cancelar'
                            addClass='w-full rounded-md'
                            action={() => {
                                setShowLoginForm(false);
                                reset()
                            }}
                            secondary={true} />
                        <MainButton
                            type='submit'
                            text={loginInProcess ? <><span>Ingresando </span><i className="fa-solid fa-spinner fa-spin"></i></> : 'Ingresar'}
                            addClass='w-full rounded-md'
                            disabled={loginInProcess ? true : false}/>
                    </article>
                    
                </form>
            </motion.div>

        </section>
    )
}