import { motion } from "framer-motion";

interface MenuButtonProps {
    open: boolean
    setOpen: (arg: boolean) => void
}

export default function MenuButton({open, setOpen} : MenuButtonProps) {
    return (
        <motion.button
            onClick={() => setOpen(!open)}
            className="relative w-8 h-8 flex flex-col justify-center items-center cursor-pointer"
            initial={false}
            animate={open ? "open" : "closed"}
        >
            <motion.span
                className="absolute h-[2px] w-6 bg-white rounded"
                variants={{
                    closed: { rotate: 0, y: -6 },
                    open: { rotate: 45, y: 0 },
                }}
                transition={{ duration: 0.3 }}
            />
            <motion.span
                className="absolute h-[2px] w-6 bg-white rounded"
                variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                }}
                transition={{ duration: 0.3 }}
            />
            <motion.span
                className="absolute h-[2px] w-6 bg-white rounded"
                variants={{
                    closed: { rotate: 0, y: 6 },
                    open: { rotate: -45, y: 0 },
                }}
                transition={{ duration: 0.3 }}
            />
        </motion.button>
    )
}