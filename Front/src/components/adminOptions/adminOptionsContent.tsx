import { useRef, useEffect } from "react"
import AdminOptionsButton from "@/components/adminOptions/adminOptionsButton";
import { useAdminOptions } from "@/context/adminOptionsContext";

interface AdminOptionsContentProps {
    children: React.ReactNode
}

export default function AdminOptionsContent({ children }: AdminOptionsContentProps) {
    
    const { showList, setShowList } = useAdminOptions();

    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        
        const hideList = (event: MouseEvent | TouchEvent) => {
            const target = event.target as HTMLElement;

            const isClickingWhileAlert = target.closest('[role="alertdialog"]');

            if (showList && buttonRef.current && !buttonRef.current.contains(event.target as Node) && listRef.current && !listRef.current.contains(event.target as Node) && !isClickingWhileAlert) setShowList(false)
        };
        
        document.addEventListener('mousedown', hideList);

        return () => {document.removeEventListener('mousedown', hideList)}

    }, [showList])

    return (
        <section className="absolute w-full h-full top-0 left-0">
            <AdminOptionsButton
                ref={buttonRef}/>
            
            {showList &&
                <>
                <div ref={listRef}>
                    {children}
                </div>
                

                <div className="absolute top-0 left-0 bg-black/40 backdrop-blur-xs w-full h-full z-5"></div>
            </>}
        </section>
    )
}