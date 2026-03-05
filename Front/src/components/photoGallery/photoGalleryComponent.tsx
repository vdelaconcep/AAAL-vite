import { useState, useEffect } from "react";
import Selector from "@/components/buttons/selector";
import SearchByDate from "./searchByDate";
/* import ListaElementos from "@/components/galeria/listaElementos"*/

type ShowType = 'all' | 'event' | 'search'


export default function Photos() {

    const [show, setShow] = useState<ShowType>('all');

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    
    const handleSearch = (from: string, to: string) => {
        setFromDate(from);
        setToDate(to);
    };

    useEffect(() => {
        setFromDate('');
        setToDate('');
    }, [show]);

    return (
        <main className="h-full bg-white py-7 md:py-10 flex flex-col items-center px-4">
            <h1 className="font-bold italic text-2xl md:text-3xl mb-5 md:mb-9">Galería de Fotos</h1>

            <section className="mb-5 md:mb-7 w-full flex gap-1">
                <Selector
                    addClass='flex-1 text-sm md:text-md lg:text-lg'
                    text='ver todas'
                    selected={show === 'all'}
                    action={() => setShow('all')} />
                <Selector
                    addClass='flex-1 text-sm md:text-md lg:text-lg'
                    text='por evento'
                    selected={show === 'event'}
                    action={() => setShow('event')} />
                <Selector
                    addClass='flex-1 text-sm md:text-md lg:text-lg'
                    text='buscar'
                    selected={show === 'search'}
                    action={() => setShow('search')} />
            </section>

            {show === 'search' &&
                <SearchByDate
                    onSearch={handleSearch}
                    addClass='mb-4'/>
            }

            {(show === 'all' || show === 'event' || (show === 'search' && fromDate && toDate)) ?
                <ListaElementos
                    key={show}
                    tipo={show}
                    fechaDesde={show === 'buscar'? fechaDesde : null}
                    fechaHasta={show === 'buscar' ? fechaHasta : null} /> : ''}
        </main>
    );
};