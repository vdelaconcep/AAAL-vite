
import { useState, useRef, useCallback } from "react";
import { useAlert } from "@/context/alertContext";
import { getEventById } from "@/services/galleryServices";
import axios from 'axios';
import type { AxiosResponse } from 'axios';

interface APIresponse<T> {
    rows: T[]
    pagination: {
        currentPage: number
        totalPages: number
        totalItems: number
        itemsPerPage: number
    }
    [key: string]: any
}

type FetchFunction<T> = (
    page: number | null,
    limit: number | null,
    fromDate?: string | null,
    toDate?: string | null,
    eventId?: string | null
) => Promise<AxiosResponse<APIresponse<T>>>

export default function useGallery <T = any>(FetchFunction: FetchFunction<T>) {

    const { showAlert } = useAlert();

    const [photos, setPhotos] = useState<
        {
            photoList: [{
                url: string,
                description: string,
                date: string
            }] | [],
            currentIndex: number | null,
            totalPhotos: number,
            eventInfo: {
                eventId: string,
                date: string
            } | null
        }>({
        photoList: [],
        currentIndex: null,
        totalPhotos: 0,
        eventInfo: null
    })

    const [loading, setLoading] = useState(false);

    const loadedPagesRef = useRef(new Set());

    const initializer = useCallback(async () => {

        loadedPagesRef.current = new Set();

        try {
            setLoading(true);

            if (photos.eventInfo) {
                const res = await getEventById(photos.eventInfo.eventId);
                const list = res.data.photos || [];
                setPhotos(prev => ({
                    photoList: list,
                    totalPhotos: list.length,
                    eventInfo: {
                        name: res.data.event_name,
                        date: res.data.date,
                        description: res.data.description
                    }
                }))
            }

            // Traer todas las fotos (paginadas)
            if (config.tipo === 'todas') {
                const res = await getFotos(1, fotosPorPagina);
                const total = res.data.paginacion.totalItems || 0;
                setTotalFotos(total);
                setTodasLasFotos(new Array(total).fill(null));
                setInfoEvento(null);
            }

            // Traer fotos buscadas por rango de fechas, paginadas
            if (config.tipo === 'buscar') {
                const res = await getFotosPorFecha(config.desde, config.hasta, 1, fotosPorPagina);
                const total = res.data.paginacion.totalItems || 0;
                setTotalFotos(total);
                setTodasLasFotos(new Array(total).fill(null));
                setInfoEvento(null);
            }

        } catch (err) {
            mostrarAlert(`Error al inicializar las imágenes: ${err.message || 'Error desconocido'}`);
            setTodasLasFotos([]);
            setTotalFotos(0);
        } finally {
            setCargando(false);
        };
    }, []);

    // Traer fotos de una página
    const fetchPage = useCallback(async (pageNum) => {

        const config = configRef.current;

        // Si busco un evento en particular (no paginado)
        if (!config || config.tipo === 'evento') return;

        // Si la página que busco ya está cargada
        if (paginasCargadasRef.current.has(pageNum)) return;

        try {
            setCargando(true);

            let res;

            // Si quiero ver todas las fotos
            if (config.tipo === 'todas') {
                res = await getFotos(pageNum, fotosPorPagina);
            } else if (config.tipo === 'buscar') {
                res = await getFotosPorFecha(
                    config.desde,
                    config.hasta,
                    pageNum,
                    fotosPorPagina
                )
            }

            if (res?.data) {
                setTodasLasFotos(prev => {
                    const fotosNuevas = [...prev];
                    const inicioIndex = (pageNum - 1) * fotosPorPagina;


                    while (fotosNuevas.length < inicioIndex + res.data.rows.length) {
                        fotosNuevas.push(null);
                    };

                    res.data.rows.forEach((foto, idx) => {
                        fotosNuevas[inicioIndex + idx] = foto;
                    });

                    return fotosNuevas;
                });
                paginasCargadasRef.current.add(pageNum);
            }

        } catch (err) {
            mostrarAlert(`Error al cargar página ${pageNum}: ${err.message || 'Error desconocido'}`);
        } finally {
            setCargando(false);
        }
    }, []);

    // Ir a la imagen siguiente
    const siguiente = useCallback(() => {

        if (currentIndex === null || currentIndex >= totalFotos - 1) return;

        const siguienteIndex = currentIndex + 1;
        setCurrentIndex(siguienteIndex);

        // Precarga de página siguiente (si es necesario)
        const config = configRef.current;

        if (config && config.tipo !== 'evento') {
            const currentPage = Math.ceil((siguienteIndex + 1) / fotosPorPagina);
            const siguientePagina = currentPage + 1;

            if (!paginasCargadasRef.current.has(siguientePagina) && siguientePagina <= Math.ceil(totalFotos / fotosPorPagina)) {
                fetchPage(siguientePagina);
            }
        }

    }, [currentIndex, totalFotos, fetchPage]);

    // Ir a la imagen anterior
    const anterior = useCallback(() => {
        if (currentIndex === null || currentIndex <= 0) return;

        const prevIndex = currentIndex - 1;
        setCurrentIndex(prevIndex);

        //Precarga de página anterior (si es necesario)
        const config = configRef.current;

        if (config && config.tipo !== 'evento') {
            const currentPage = Math.ceil((prevIndex + 1) / fotosPorPagina);
            const prevPagina = currentPage - 1;

            if (prevPagina > 0 && !paginasCargadasRef.current.has(prevPagina)) {
                fetchPage(prevPagina);
            }
        }
    }, [currentIndex, fetchPage]);

    // Abrir el modal con una imagen a la que corresponde un índice específico
    const abrirModal = useCallback(async (index) => {
        const config = configRef.current;

        // Casos no paginados
        if (config && config.tipo === 'evento') {
            setCurrentIndex(index);
            return;
        }

        // Casos con paginación
        const paginaNecesaria = Math.ceil((index + 1) / fotosPorPagina);

        if (!paginasCargadasRef.current.has(paginaNecesaria)) {
            await fetchPage(paginaNecesaria);
        };

        setCurrentIndex(index);
    }, [fetchPage]);

    // Cerrar modal
    const cerrarModal = useCallback(() => {
        setCurrentIndex(null);
    }, []);

    return {
        // Estado
        todasLasFotos,
        currentIndex,
        currentFoto: currentIndex !== null ? todasLasFotos[currentIndex] : null,
        cargando,
        totalFotos,
        modalAbierto: currentIndex !== null,
        infoEvento,

        // Acciones
        inicializarGaleria,
        abrirModal,
        cerrarModal,
        siguiente,
        anterior,

        // Helpers
        hasNext: currentIndex !== null && currentIndex < totalFotos - 1,
        hasPrevious: currentIndex !== null && currentIndex > 0,
    };

};