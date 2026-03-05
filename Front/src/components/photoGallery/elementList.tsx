import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAlert } from '@/context/alertContext';
import { usePaginacion } from '@/hooks/usePaginacion';
import { useGaleriaModal } from '@/hooks/useGaleriaModal';
import { getFotos, getFotosPorFecha, getEventos } from '@/services/galeriaServices';
import Cargando from '@/components/otros/cargando';
import FotoCard from '@/components/galeria/fotoCard';
import EventoCard from '@/components/galeria/eventoCard'
import ControlPagina from '@/components/otros/controlPagina';
import ModalFoto from './modalFoto';

const ListaElementos = ({ tipo, fechaDesde = null, fechaHasta = null}) => {

    const { mostrarAlert } = useAlert();

    const funcionGet = tipo === 'evento' ? getEventos : getFotos;
    const funcionGetPorFecha = getFotosPorFecha;
    const limit = tipo === 'evento' ? 11 : 21;
    
    const {
        datos,
        cargando,
        pagina,
        setPagina,
        totalPaginas,
        accion,
        setAccion
    } = usePaginacion(
        (page, limit) => {
            if (fechaDesde && fechaHasta) {
                return funcionGetPorFecha(fechaDesde, fechaHasta, page, 21);
            }
            return funcionGet(page, limit);
        },
        mostrarAlert,
        1,
        limit,
        [fechaDesde, fechaHasta]
    );
    
    const galeria = useGaleriaModal();

    useEffect(() => {
        if (tipo === 'evento') return;

        if (tipo === 'buscar' && fechaDesde && fechaHasta) {
            galeria.inicializarGaleria({
                tipo: 'buscar',
                desde: fechaDesde,
                hasta: fechaHasta
            });
        } else {
            galeria.inicializarGaleria({ tipo: 'todas' });
        }
        
    }, [fechaDesde, fechaHasta, tipo]);

    const handleFotoClick = (indexLocal) => {
        const indexGlobal = (pagina - 1) * limit + indexLocal;
        galeria.abrirModal(indexGlobal);
    };

    const handleEventoClick = async (eventoId) => {
        await galeria.inicializarGaleria({
            tipo: 'evento',
            eventoId: eventoId
        });
        galeria.abrirModal(0);
    };
    
    return (
        <>
        <section>
                {cargando ? 
                    <Cargando /> : (datos.length > 0 ?
                    <motion.div
                        className={`grid ${limit > 15 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-3 md:gap-4 w-full justify-center mb-3`}
                    key={pagina}
                    {... (accion === 'siguiente' ? {
                        initial: { x: 100, opacity: 0 },
                        transition: { duration: 0.9 },
                        animate: { x: 0, opacity: 1 }
                    } : (accion === 'anterior' ? {
                        initial: { x: -100, opacity: 0 },
                        transition: { duration: 0.9 },
                        animate: { x: 0, opacity: 1 }
                    } : {
                        initial: { y: 50, opacity: 0 },
                        transition: { duration: 0.9 },
                        animate: { y: 0, opacity: 1 }
                    }))}>
                    {
                        datos.map((dato, index) => 
                            <div key={dato.id}>
                                {tipo === 'evento' ?
                                    <EventoCard
                                        dato={dato}
                                        onClick={() => handleEventoClick(dato.id)} />
                                    : <FotoCard
                                        dato={dato}
                                        onClick={() => handleFotoClick(index)} />
                                }
                            </div>
                        )
                    }
                </motion.div>

                : <h6>No hay fotos para mostrar</h6>)}
        </section>

        {!cargando && datos.length > 0 &&
            <div className='py-4'>
                <ControlPagina
                    pagina={pagina}
                    setPagina={setPagina}
                    totalPaginas={totalPaginas}
                    setAccion={setAccion} />
            </div>}
            
        <ModalFoto galeria={galeria} />
        </>
    );
};

export default ListaElementos;