import { useConfirm } from "@/context/confirmContext";
import { motion } from "framer-motion";
import MainButton from "@/components/buttons/mainButton";

export default function ConfirmComponent() {

    const { visible, confirmText, proceed, inProcess, hideConfirm } = useConfirm();

    if (!visible) return null;

    return (
        <article
            role="confirmdialog"
            className='fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center px-2'
            onClick={(e) => e.stopPropagation()}>
            
            <motion.div 
                className="bg-gray-300 border-2 border-[#6E1538] p-4 rounded-lg shadow-md shadow-gray-500 w-full sm:max-w-sm mx-auto relative"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1, transition: {duration: 0.4} }}
            >
                <p className="text-center">{confirmText}</p>

                <div className='flex justify-center mt-4'>
                    <MainButton
                        type="button"
                        addClass="w-full mr-1"
                        action={() => hideConfirm()}
                        secondary={true}
                    />
                    <MainButton
                        type='button'
                        text={inProcess ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Confirmar'}
                        addClass="w-full ml-1"
                        action={proceed}
                        disabled={inProcess} />
                </div>
            </motion.div>
        </article>
    );
};