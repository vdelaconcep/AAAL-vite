import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import MenuButton from "@/components/navigation/menuButton";
import { websiteMap } from "@/components/navigation/websiteMap";
import { Link, useLocation } from "react-router-dom";
import { clearString } from "@/utils/clearString";


export default function NavigationComponent() {

    const [displayList, setDisplayList] = useState<string | null>(null)
    
    const [openMenu, setOpenMenu] = useState<boolean>(false);

    const navRef = useRef<HTMLElement | null>(null);
    const listRef = useRef<{ [key: string]: HTMLUListElement | null }>({});

    const toggleDisplay = (section: string): void => {
        setDisplayList(displayList === section ? null : section)
    };

    const location = useLocation();

    const isMainSection = useMemo(() => {
        return location.pathname === '/';
    }, [location.pathname])

    useEffect(() => {
        const closeMenuOrList = (e: Event) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setDisplayList(null);
                setOpenMenu(false);
            }
        };
        document.addEventListener("click", closeMenuOrList);
        return () => document.removeEventListener("click", closeMenuOrList);
    }, []);

    return (
        <nav
            ref={navRef}
            className="bg-[#78a7a5] border-b-[2px] border-b-[#5b807e] md:text-[#d3fffd] text-lg md:text-xl relative md:pr-6"
        >
            <div className="flex justify-end md:hidden py-1 pr-4">
                <MenuButton
                    open={openMenu}
                    setOpen={setOpenMenu}/>
            </div>

            <motion.ul
                className={`flex-col md:flex md:flex-row justify-end md:space-x-2 overflow-hidden md:overflow-visible md:h-auto! md:opacity-100! ${openMenu ? "absolute top-full left-0 w-full bg-gray-200 border-b-[3px] border-b-gray-400 md:border-none shadow-lg shadow-gray-800 z-70 md:static md:bg-transparent md:w-auto md:z-auto flex" : "md:flex hidden"}`}
                style={{ opacity: `${openMenu ? 1 : 0}`}}
                initial={false}
                animate={{
                    height: openMenu ? "auto" : 0
                }}
                transition={{ duration: 0.3 }}
            >
                {websiteMap.map((section) => {
                    if (section.sectionTitle === 'Principal' && isMainSection) return null
                    return <li
                        key={section.sectionTitle}
                        className="relative cursor-pointer font-medium w-full md:w-auto md:border-none"
                        onMouseLeave={() => {
                            if (window.innerWidth >= 768) {
                                setDisplayList(null);
                            }
                        }}>
                        <button
                            className="cursor-pointer md:text-shadow-xs md:text-shadow-gray-800 hover:text-white rounded p-2 px-4 w-full text-left md:text-center text-lg font-bold md:text-xl md:font-medium"
                            aria-expanded={displayList === section.sectionTitle}
                            aria-haspopup={section.subSections ? true : undefined}
                            onMouseOver={() => {
                                if (window.innerWidth >= 768) {
                                    toggleDisplay(section.sectionTitle);
                                    if (!section.subSections) setOpenMenu(false)
                                }
                            }}
                            onClick={() => {
                                if (window.innerWidth < 768) {
                                    toggleDisplay(section.sectionTitle);
                                    if (!section.subSections) setOpenMenu(false)
                                }
                            }}
                        >
                            {section.subSections ? section.sectionTitle :
                                <Link to={section.sectionTitle === 'Principal' ? '/' : `/${clearString(section.sectionTitle)}`}>{section.sectionTitle}</Link>}
                        </button>
                        
                        {/* Desktop */}
                        {section.subSections && (
                            <>
                                <ul
                                    className={`hidden md:block md:absolute md:bg-gray-300 md:text-lg md:rounded md:shadow-xl md:shadow-black md:w-40 md:transform md:transition-all md:duration-300 md:origin-top md:z-70 ${displayList === section.sectionTitle ? "md:opacity-100 md:scale-y-100" : "md:opacity-0 md:scale-y-0 md:pointer-events-none"}`}
                                >
                                    {section.subSections.map((i, index) => (
                                        <li
                                            key={`${section.sectionTitle}-${index}`}
                                            className="p-2 pl-3 text-gray-900 hover:bg-[#6E1538] hover:text-white rounded"
                                            onClick={() => setDisplayList(null)}>
                                            <Link to={`/${clearString(section.sectionTitle)}/${clearString(i)}`}>{i}</Link>
                                        </li>
                                    ))}
                                </ul>
                                
                                {/* Mobile display */}
                                <ul
                                    ref={(el) => { listRef.current[section.sectionTitle] = el }}
                                    className="flex flex-col md:hidden overflow-hidden transition-[height,opacity] duration-300 bg-gray-300"
                                    style={{
                                        height:
                                            displayList === section.sectionTitle
                                                ? `${listRef.current[section.sectionTitle]?.scrollHeight || 0}px`
                                                : "0px",
                                        opacity: displayList === section.sectionTitle ? 1 : 0,
                                    }}
                                >
                                    {section.subSections.map((i, index) => (
                                        <li
                                            key={`${section.sectionTitle}-${index}`}
                                            className="pl-6 py-2 active:bg-[#6E1538] active:text-white"
                                            onClick={() => {
                                                setOpenMenu(false);
                                                setDisplayList(null);
                                            }}>
                                            <Link to={`/${clearString(section.sectionTitle)}/${clearString(i)}`}>{i}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </li>
                })}
            </motion.ul>
        </nav>
    )
}