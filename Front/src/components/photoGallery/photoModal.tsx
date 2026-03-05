import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import formatUTCDate from '@/utils/formatUTCDate';

interface GalleryType {
    openModal: boolean
    currentPhoto: {
        url: string,
        event: string,
        date: string,
        description: string
    }
    currentIndex: number
    totalPhotos: number
    closeModal: () => void
    next: () => void
    previous: () => void
    hasNext: boolean
    hasPrevious: boolean
    loading: boolean
    eventInfo: {
        name: string,
        date: string
    }
}

export default function PhotoModal({ gallery }: { gallery: GalleryType }) {
    const {
        openModal,
        currentPhoto,
        currentIndex,
        totalPhotos,
        closeModal,
        next,
        previous,
        hasNext,
        hasPrevious,
        loading,
        eventInfo
    } = gallery;

    useEffect(() => {
        if (!openModal) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowRight' && hasNext) next();
            if (e.key === 'ArrowLeft' && hasPrevious) previous();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [openModal, hasNext, hasPrevious, closeModal, next, previous]);

    // Manejar gestos táctiles (swipe)
    const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
        e.currentTarget.dataset.touchStart = e.touches[0].clientX.toString();
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
        const touchStart = parseFloat(e.currentTarget.dataset.touchStart ?? '');
        if (isNaN(touchStart)) return;
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd

        if (Math.abs(diff) > 50) {
            if (diff > 0 && hasNext) {
                next();
            } else if (diff < 0 && hasPrevious) {
                previous();
            }
        }
    };

    return (
        <AnimatePresence>
            {openModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
                    onClick={closeModal}
                >
                    <section
                        className="relative w-full h-full flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-white md:text-gray-300 md:hover:text-white md:transition-colors z-20 bg-black bg-opacity-50 rounded-full p-2 cursor-pointer"
                            aria-label="Cerrar"
                        >
                            <X size={32} />
                        </button>

                        <button
                            onClick={previous}
                            disabled={!hasPrevious}
                            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default z-20 bg-black bg-opacity-50 rounded-full p-3"
                            aria-label="Anterior"
                        >
                            <ChevronLeft size={40} />
                        </button>

                        <div className="max-w-7xl w-full h-full flex flex-col">
                            {currentPhoto ? (
                                <>
                                    <article className="flex-1 flex items-center justify-center mb-4 min-h-0">
                                        <motion.img
                                            key={currentIndex}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.2 }}
                                            src={currentPhoto.url}
                                            alt={currentPhoto.description || 'Foto'}
                                            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
                                        />
                                    </article>
                                    <article className="hidden md:block mt-3 text-center text-sm text-gray-500">
                                        Foto {currentIndex + 1} de {totalPhotos}
                                    </article>

                                    <motion.article
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="bg-gray-900 bg-opacity-90 rounded-lg p-4 md:p-6 text-white max-h-[20vh]"
                                    >
                                        <div className='flex flex-col md:flex-row md:items-baseline md:gap-2'>
                                            <h3 className="text-md md:text-xl font-semibold mb-2">
                                                {eventInfo ? eventInfo.name : currentPhoto.event}
                                            </h3>
                                            <span className='text-xs md:text-sm text-gray-400'>{eventInfo ? formatUTCDate(eventInfo.date).slice(0, 8) : formatUTCDate(currentPhoto.date).slice(0, 8)}</span>
                                        </div>
                                        
                                        {currentPhoto.description && (
                                            <p className="text-gray-300 text-sm md:text-base mb-3">
                                                {currentPhoto.description}
                                            </p>
                                        )}
                                    </motion.article>

                                    <div className="md:hidden flex justify-between items-center mt-4 px-4">
                                        <button
                                            onClick={previous}
                                            disabled={!hasPrevious}
                                            className="text-white bg-black bg-opacity-50 rounded-full px-3 disabled:opacity-30"
                                            aria-label="Anterior"
                                        >
                                            <ChevronLeft size={28} />
                                        </button>

                                        <div className="text-white text-sm">
                                            {currentIndex + 1} / {totalPhotos}
                                        </div>

                                        <button
                                            onClick={next}
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
                                        {loading ? (
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
                            onClick={next}
                            disabled={!hasNext}
                            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default z-20 bg-black bg-opacity-50 rounded-full p-3"
                            aria-label="Siguiente"
                        >
                            <ChevronRight size={40} />
                        </button>

                        {loading && currentPhoto && (
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