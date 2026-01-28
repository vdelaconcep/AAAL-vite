import { motion } from 'framer-motion';
import logo_facah from '/img/logos/logo-facah.png';


export default function Facah() {
    return (
        <section className="bg-[#6B9795] border-b-2 border-b-[#4c6d6b]  p-4 md:px-8 md:py-6">
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                transition={{ duration: 0.8 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                className='flex items-center justify-center'>
                <h1 className="mr-2 md:mr-7 font-bold text-sm md:text-xl text-white italic text-shadow-gray-900 text-shadow-2xs w-80">La Asociación de Autos Antiguos de Lanús es una asociación miembro de <a href="https://facah.com.ar/" title='Ir a página de FACAH' target="_blank" rel="noopener noreferrer">FACAH</a></h1>
                <a
                    href="https://facah.com.ar/"
                    target="_blank"
                    rel="noopener noreferrer">
                    <img src={logo_facah}
                        alt="Logo FACAH"
                        style={{ width: "150px" }} title='Ir a página de FACAH' className='cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105' />
                </a>
            </motion.div>
        </section>
    )
};