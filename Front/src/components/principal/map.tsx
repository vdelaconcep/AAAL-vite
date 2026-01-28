import { motion } from "framer-motion";

export default function Map() {
    return (
        <section className="bg-[#A0AB94] border-b-[2px] border-b-[#858f7b] w-full p-4 md:px-10 md:py-6">
            <h1 className="mb-2 md:mb-5 font-bold text-lg md:text-xl italic text-gray-900">Dónde estamos</h1>
            <article className="flex flex-col items-center">

                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="w-full relative pb-[60%] md:pb-[100%]"
                >
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.7535495728057!2d-58.4176390334281!3d-34.68616902118912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccc60204be501%3A0xb24f60cfb640a203!2sViamonte%202615%2C%20B1824%20Valent%C3%ADn%20Alsina%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1756140255680!5m2!1ses!2sar" className="rounded-lg absolute top-0 left-0 w-full h-full shadow-sm shadow-gray-900" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </motion.div>

                <p className="text-sm mt-3">Nuestra sede se encuentra en la <span className="font-bold">Avenida Viamonte 2615</span> (junto al Parque Gral. San Martin) en Lanús Oeste, Provincia de Buenos Aires</p>

            </article>
        </section>
    );
};