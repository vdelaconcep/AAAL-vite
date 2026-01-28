import { useState, useRef, useEffect } from 'react';
import LoginForm from '@/components/auth/loginForm'


export default function LoginComponent ({addClass}: {addClass: string}) {

    const [showLoginForm, setShowLoginForm] = useState(false);

    const formRef = useRef<HTMLDivElement | null>(null);
    const btnRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const closeLoginForm = (event: MouseEvent | TouchEvent) => {
            if (showLoginForm && formRef.current && !formRef.current.contains(event.target as Node) && !btnRef.current?.contains(event.target as Node)) setShowLoginForm(false)
        }
        
        document.addEventListener('click', closeLoginForm);
        return () => document.removeEventListener('click', closeLoginForm);
    }, [showLoginForm, setShowLoginForm])

    return (
        <>
            <article className={addClass || ''}>
                <button
                    ref={btnRef}
                    className="border-none text-[14px] md:text-lg text-gray-600 hover:underline active:underline cursor-pointer"
                    title='Ingresá como administrador'
                    onClick={() => setShowLoginForm(true)}>
                    <span>Ingresar </span>
                    <i className="fa-solid fa-wrench"></i>
                </button>
            </article>
            {showLoginForm &&
                <LoginForm
                    ref= {formRef}
                    setShowLoginForm={setShowLoginForm} />}
        </>
        
    )
};