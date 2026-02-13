import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import formatearUTC from '@/utils/formatearUTC'

const PhotoModal = ({ gallery }) => {
    const {
        modalAbierto,
        currentFoto,
        currentIndex,
        totalFotos,
        cerrarModal,
        siguiente,
        anterior,
        hasNext,
        hasPrevious,
        cargando,
        infoEvento
    } = galeria;

    useEffect(() => {
        if (!modalAbierto) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') cerrarModal();
            if (e.key === 'ArrowRight' && hasNext) siguiente();
            if (e.key === 'ArrowLeft' && hasPrevious) anterior();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [modalAbierto, hasNext, hasPrevious, cerrarModal, siguiente, anterior]);

    // Manejar gestos táctiles (swipe)
    const handleTouchStart = (e) => {
        e.currentTarget.dataset.touchStart = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        const touchStart = parseFloat(e.currentTarget.dataset.touchStart);
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;

        if (Math.abs(diff) > 50) {
            if (diff > 0 && hasNext) {
                siguiente();
            } else if (diff < 0 && hasPrevious) {
                anterior();
            }
        }
    };

    return (
        <AnimatePresence>
            {modalAbierto && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
                    onClick={cerrarModal}
                >
                    <section
                        className="relative w-full h-full flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        <button
                            onClick={cerrarModal}
                            className="absolute top-4 right-4 text-white md:text-gray-300 md:hover:text-white md:transition-colors z-20 bg-black bg-opacity-50 rounded-full p-2 cursor-pointer"
                            aria-label="Cerrar"
                        >
                            <X size={32} />
                        </button>

                        <button
                            onClick={anterior}
                            disabled={!hasPrevious}
                            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default z-20 bg-black bg-opacity-50 rounded-full p-3"
                            aria-label="Anterior"
                        >
                            <ChevronLeft size={40} />
                        </button>

                        <div className="max-w-7xl w-full h-full flex flex-col">
                            {currentFoto ? (
                                <>
                                    <article className="flex-1 flex items-center justify-center mb-4 min-h-0">
                                        <motion.img
                                            key={currentIndex}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.2 }}
                                            src={currentFoto.url}
                                            alt={currentFoto.descripcion || 'Foto'}
                                            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
                                        />
                                    </article>
                                    <article className="hidden md:block mt-3 text-center text-sm text-gray-500">
                                        Foto {currentIndex + 1} de {totalFotos}
                                    </article>

                                    <motion.article
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="bg-gray-900 bg-opacity-90 rounded-lg p-4 md:p-6 text-white max-h-[20vh]"
                                    >
                                        <div className='flex flex-col md:flex-row md:items-baseline md:gap-2'>
                                            <h3 className="text-md md:text-xl font-semibold mb-2">
                                                {infoEvento ? infoEvento.nombre : currentFoto.evento}
                                            </h3>
                                            <span className='text-xs md:text-sm text-gray-400'>{infoEvento ? formatearUTC(infoEvento.fecha).slice(0, 8) : formatearUTC(currentFoto.fecha).slice(0, 8)}</span>
                                        </div>
                                        
                                        {currentFoto.descripcion && (
                                            <p className="text-gray-300 text-sm md:text-base mb-3">
                                                {currentFoto.descripcion}
                                            </p>
                                        )}
                                    </motion.article>

                                    <div className="md:hidden flex justify-between items-center mt-4 px-4">
                                        <button
                                            onClick={anterior}
                                            disabled={!hasPrevious}
                                            className="text-white bg-black bg-opacity-50 rounded-full px-3 disabled:opacity-30"
                                            aria-label="Anterior"
                                        >
                                            <ChevronLeft size={28} />
                                        </button>

                                        <div className="text-white text-sm">
                                            {currentIndex + 1} / {totalFotos}
                                        </div>

                                        <button
                                            onClick={siguiente}
                                            disabled={!hasNext}
                                            className="text-white bg-black bg-opacity-50 rounded-full px-3 disabled:opacity-30"
                                            aria-label="Siguiente"
                                        >
                                            <ChevronRight size={28} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-white text-xl">
                                        {cargando ? (
                                            <article className="flex flex-col items-center gap-4">
                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                                                <span>Cargando foto...</span>
                                            </article>
                                        ) : (
                                            'Foto no disponible'
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={siguiente}
                            disabled={!hasNext}
                            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default z-20 bg-black bg-opacity-50 rounded-full p-3"
                            aria-label="Siguiente"
                        >
                            <ChevronRight size={40} />
                        </button>

                        {cargando && currentFoto && (
                            <article className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-xs bg-gray-800 px-3 py-1 rounded-full opacity-75">
                                Cargando más fotos...
                            </article>
                        )}
                    </section>
                </motion.div>
            )}
        </AnimatePresence>
    );
};