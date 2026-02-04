import { motion } from "framer-motion";

interface AdminOptionsListProps {
    title: string
    list: React.ReactElement
    addClass?: string
}

export default function AdminOptionsList({ title, list, addClass } : AdminOptionsListProps) {
    return (
        <motion.article
            className={`${addClass} rounded-md bg-gray-700 shadow-sm shadow-gray-600 border-black border-2 cursor-pointer absolute top-5 left-19 overflow-hidden text-white text-lg origin-top z-8`}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}>
            
            <div className="p-2 font-semibold">
                {title}
            </div>

            <hr className="text-gray-400" />
            
            {list}

        </motion.article>
        
    )
}