import { motion } from "framer-motion";
import { useState } from "react";

export default function Story() {
    const [viewMore, setViewMore] = useState(false);
    const hiddenParagraphs = `pb-4 ${viewMore ? "block" : "hidden md:block"}`;

    return (
        <section
            className="bg-[#6B9795] border-b-2 border-b-[#4c6d6b] w-full px-4 md:px-10 py-4 md:py-6">
            
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                transition={{ duration: 0.8 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                >
                <h1 className="mb-2 md:mb-5 pt-3 md:pt-4 font-bold text-lg md:text-xl italic text-white text-shadow-gray-900 text-shadow-2xs">
                    Nuestra historia
                </h1>
                <article
                    className={`relative md:columns-2 md:gap-8 text-gray-200 text-sm md:text-md ${viewMore ? "" : "max-h-48 overflow-hidden md:max-h-none md:overflow-visible"}`}>
                    <div>
                        <p className="pb-4">
                            Teodoro Hunko y Jorge Enrique Schneebeli fundaron el{" "}
                            <b className="texto-crema">
                                Club Asociación de Automóviles Antiguos de Lanús
                            </b>{" "}
                            el <b className="texto-crema">24 de septiembre del 2000</b>.
                        </p>

                        <p className={hiddenParagraphs}>
                            En el pasado nuestro Club tenia el nombre de Automoto Club y luego
                            tomó el nombre actual, que hoy en día es{" "}
                            <b className="texto-crema">Automóviles Antiguos de Lanús</b>.
                        </p>

                        <p className={hiddenParagraphs}>
                            Nuestra sede se encuentra en la{" "}
                            <b className="texto-crema">Avenida Viamonte 2615</b>, Lanús Oeste
                            (Parque Gral. San Martin)
                        </p>
                    </div>

                    <div>
                        <p className={hiddenParagraphs}>
                            Estamos{" "}
                            <b className="texto-crema">al servicio de los socios y de la comunidad</b>{" "}
                            y somos convocados a eventos ya sea en entidades educativas o salas
                            de primeros auxilios, entre otras.
                        </p>

                        <p className={hiddenParagraphs}>
                            Queremos invitarlos a que recorran nuestro sitio web y puedan
                            disfrutar de nuestro contenido con las fotos de autos antiguos,
                            información sobre el club, eventos e historias.
                        </p>

                        <p className={hiddenParagraphs}>¡Muchas gracias por visitarnos!</p>
                    </div>

                    {!viewMore && (
                        <span className="absolute bottom-0 left-0 w-full h-16 bg-linear-to-t from-[#6B9795] to-transparent pointer-events-none z-0 md:hidden"></span>
                    )}
                </article>
            </motion.div>
            

            <div className="text-black font-medium flex flex-col items-center relative z-10 md:hidden">
                <button
                    className="mb-2 flex flex-col text-center"
                    onClick={() => setViewMore(!viewMore)}
                >
                    <i
                        className={`fa-solid ${viewMore ? "fa-chevron-up" : "fa-chevron-down mt-[-30px]"
                            } mb-[-7px]`}
                    ></i>
                    {viewMore ? "ver menos" : "ver más"}
                </button>
            </div>
        </section>
    );
};