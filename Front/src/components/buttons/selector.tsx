


interface SelectorProps {
    type?: "submit" | "reset" | "button" | undefined
    text: string
    action?: () => void
    addClass?: string
    selected: boolean
}


export default function Selector({ type, text, action, addClass, selected}: SelectorProps) {
    return (
        <button
            className={`border-b-[5px] ${selected ? 'bg-[#c8d2d1] border-b-[#6B9795]' : 'bg-gray-200 border-b-gray-300'}  hover:bg-gray-300 active:bg-gray-300 font-medium cursor-pointer py-2 first-of-type:rounded-l-xl last-of-type:rounded-r-xl shadow-xs shadow-gray-500 ${addClass && addClass}`}
            type={type || "button"}
            onClick={action && action}
        >
            {text}
        </button>
    );
};
