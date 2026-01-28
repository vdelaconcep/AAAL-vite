import LoginComponent from "@/components/auth/loginComponent"

export default function Footer() {
    return (
        <footer className="bg-black px-4 pt-8 md:pt-10 pb-8 min-[450px]:text-center">
            <p className="text-gray-400 text-[14px] md:text-lg font-semibold">Club Asociación de Automóviles Antiguos de Lanús</p>
            <p className="text-gray-400 text-[14px] mb-7 md:mb-10">Viamonte 2615, Lanús, Pcia. de Buenos Aires</p>

            <a className="text-white text-[17px] md:text-lg border border-gray-500 rounded-md p-1 px-2" href="https://www.instagram.com/aaalanus?igsh=dmhzeG5pZ2NuMHVt" title='Ir a página de Instagram de AAAL' target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-instagram bg-linear-to-tr from-[#F57621] via-[#F41267] to-[#7C32A9] font-extrabold text-transparent bg-clip-text"></i> Seguinos en Instagram</a>

            <div className="sm:flex items-center mt-7 md:mt-10 gap-2 min-[450px]:justify-center">
                <LoginComponent addClass='mb-3 sm:mb-0' />
                <span className="text-gray-600 text-[14px] md:text-lg hidden sm:block"> - </span>
                <p className="text-gray-600 text-[14px] md:text-lg">Sitio web desarrollado por <a href="https://portfolio-dlc.vercel.app/" title='Ir a portfolio de la desarrolladora' target="_blank" rel="noopener noreferrer"><span className="font-bold">DLC</span> <i className="fa-solid fa-crow"></i></a></p>
            </div>
            
        </footer>
    )
};