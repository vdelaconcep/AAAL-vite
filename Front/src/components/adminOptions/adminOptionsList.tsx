import { motion } from "framer-motion";

interface AdminOptionsListProps {
    title: string
    list: React.ReactElement
    addClass?: string
}

export default function AdminOptionsList({ title, list, addClass }: AdminOptionsListProps) {
    return (
        <motion.article
            className={`${addClass} rounded-lg bg-black p-[2px] shadow-sm shadow-gray-600 absolute top-4 left-17 overflow-hidden text-white text-lg origin-top z-8`}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}>
            <div className={`rounded-[6px] bg-black border-2 border-white`}>
            <div className="p-2 px-4 font-semibold">
                {title}
            </div>

            <hr className="text-gray-400" />
            
            {list}
            </div>
        </motion.article>
        
    )
}