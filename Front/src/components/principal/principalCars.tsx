import { motion } from "framer-motion";
import MainButton from "@/components/buttons/mainButton";
import image1 from '/img/principalCars/foto1.jpg';
import image2 from '/img/principalCars/foto2.jpg';
import image3 from '/img/principalCars/foto-3.jpg';
import image4 from '/img/principalCars/foto-4.jpg';
import image5 from '/img/principalCars/foto-5.jpg';
import image6 from '/img/principalCars/foto-6-2.jpg';

export default function PrincipalCars() {

    const cars = [image1, image2, image3, image4, image5, image6];

    return (
        <section className="bg-[#DECBA0] border-b-[2px] border-b-[#bdad89] p-4 w-full md:px-10 md:py-6 overflow-hidden">
            <h1 className="mb-2 md:mb-5 font-bold text-lg md:text-xl italic text-gray-900">Nuestros vehículos</h1>

            <div className="flex flex-wrap">
                {cars.map((n, i) => {

                    const evenPhoto = (i % 2 === 0);

                    return (
                        <motion.article
                            className="w-1/2 py-1 md:pb-7 even:pl-1 md:even:pl-4 odd:pr-1 md:odd:pr-4"
                            key={i}
                            initial={{ opacity: 0, x: evenPhoto ? -30 : 30 }}
                            transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}>
                            <img
                                src={n}
                                alt={`foto-${i + 1}`}
                                className="rounded-xl shadow-sm  shadow-gray-900 md:cursor-pointer md:hover:shadow-md"
                            />
                        </motion.article>
                    );
                })}
            </div>
            <article className="flex justify-center">
                <MainButton
                    type='button'
                    text='ver más'
                    addClass='px-6 md:px-10 mt-4' />
            </article>
        </section>
    );
};