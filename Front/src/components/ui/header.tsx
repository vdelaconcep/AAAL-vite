import { Link } from "react-router-dom"

export default function Header() {
    const titleFontSize = 'text-[1.6rem] min-[400px]:text-[2rem] min-[500px]:text-[2.2rem] sm:text-5xl lg:text-6xl'
    const titleWidth = 'max-w-[320px] min-[400px]:max-w-[370px] min-[500px]:max-w-[350px] sm:max-w-[500px] lg:max-w-[750px]'
    const TitleFirstLetter = 'text-[2rem] min-[400px]:text-[2.2rem] min-[500px]:text-[2.6rem] sm:text-[3.3rem] lg:text-[4.2rem]'
    const logoHeight = 'h-[120px] min-[400px]:h-[150px] sm:h-auto sm:max-h-[170px] lg:max-h-[220px]'

    return (
        <header className='bg-linear-to-b from-[#350a1b] to-[#8a1a47] py-3 px-2'>
            <div className='flex min-[420px]:gap-1 text-white justify-center items-center w-full flex-col sm:flex-row'>
                <article>
                    <Link to="/">
                        <img className={`aspect-ratio:1/1 ${logoHeight} mb-2 sm:mb-0`} src='/img/logos/logo-asociacion-grande.png' alt="Logo Asociacion Automoviles Antiguos de Lanus"
                        loading='eager'/>
                    </Link>
                </article>
                
                <article className='flex-col items-center justify-center text-center'>
                    <h2 className={`${titleFontSize} font-medium mrAlex text-shadow-lg text-shadow-black leading-none ${titleWidth}`}>
                        <span className={TitleFirstLetter}>A</span>SOCIACION DE <span className={TitleFirstLetter}>A</span>UTOMOVILES <span className={TitleFirstLetter}>A</span>NTIGUOS DE <span className={TitleFirstLetter}>L</span>ANUS
                    </h2>
                    <h5 className='text-center italic text-sm sm:text-sm md:text-lg lg:text-xl mt-1 text-[#ddc7d0] md:mt-2'>Fundada el 24 de septiembre del 2000</h5>
                </article>
            </div>
        </header>
    )
}