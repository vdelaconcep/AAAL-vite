import { useAlert } from "@/context/alertContext";
import { motion } from "framer-motion";
import MainButton from "@/components/buttons/mainButton";

export default function AlertComponent() {

    const { visible, alertText, important, hideAlert } = useAlert();

    if (!visible) return null;

    return (
        <article
            className='fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center px-2'
            onClick={(e) => e.stopPropagation()}>
            
            <motion.div 
                className="bg-gray-300 border-2 border-[#6E1538] p-4 rounded-lg shadow-md shadow-gray-500 w-full sm:max-w-sm mx-auto relative"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1, transition: {duration: 0.4} }}
            >
                {important && <h2 className="text-xl font-bold mb-4 text-center">IMPORTANTE</h2>}
                <p className="text-center">{alertText}</p>

                <div className='flex justify-center mt-4'>
                    <MainButton
                        type='button'
                        text='OK'
                        addClass='px-10'
                        action={() => hideAlert()} />
                </div>
            </motion.div>
        </article>
    );
};