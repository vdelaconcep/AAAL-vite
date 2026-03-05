import { useState, useEffect } from "react";
import ListaElementos from "@/components/galeria/listaElementos";
import Busqueda from "@/components/galeria/busqueda";
import Selector from "@/components/botones/selector";


const Fotos = () => {

    const [show, setShow] = useState('todas');

    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    
    const handleBusqueda = (desde, hasta) => {
        setFechaDesde(desde);
        setFechaHasta(hasta);
    };

    useEffect(() => {
        setFechaDesde('');
        setFechaHasta('');
    }, [show]);

    return (
        <main className="h-full bg-white py-7 md:py-10 flex flex-col items-center px-4">
            <h1 className="font-bold italic text-2xl md:text-3xl mb-5 md:mb-9">Galería de Fotos</h1>

            <section className="mb-5 md:mb-7 w-full flex gap-1">
                <Selector
                    clase='flex-1 text-sm md:text-md lg:text-lg'
                    texto='ver todas'
                    seleccionado={show === 'todas'}
                    accion={() => setShow('todas')} />
                <Selector
                    clase='flex-1 text-sm md:text-md lg:text-lg'
                    texto='por evento'
                    seleccionado={show === 'evento'}
                    accion={() => setShow('evento')} />
                <Selector
                    clase='flex-1 text-sm md:text-md lg:text-lg'
                    texto='buscar'
                    seleccionado={show === 'buscar'}
                    accion={() => setShow('buscar')} />
            </section>

            {show === 'buscar' &&
                <Busqueda
                onBuscar={handleBusqueda}
                clase='mb-4'/>
            }

            {(show === 'todas' || show === 'evento' || (show === 'buscar' && fechaDesde && fechaHasta)) ?
                <ListaElementos
                    key={show}
                    tipo={show}
                    fechaDesde={show === 'buscar'? fechaDesde : null}
                    fechaHasta={show === 'buscar' ? fechaHasta : null} /> : ''}
        </main>
    );
};

export default Fotos;