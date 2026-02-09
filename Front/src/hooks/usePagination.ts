import { useState, useEffect, useRef } from 'react';
import type { DependencyList } from 'react';
import { useAlert } from '@/context/alertContext';
import axios from 'axios';
import type { AxiosResponse } from 'axios';

interface APIresponse<T> {
    rows: T[]
    pagination: {
        totalPages: number
    }
    [key: string]: any
}

type FetchFunction<T> = (page: number, limit: number) => Promise<AxiosResponse<APIresponse<T>>>

export const usePagination = <T = any> (
    fetchFunction: FetchFunction<T>,
    initial = 1,
    limit = 20,
    dependencies: DependencyList = []) => {
    
    const { showAlert } = useAlert();

    const [data, setData] = useState<T[]>([]);
    const [cache, setCache] = useState<Record<number, T[]>>({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(initial);
    const [totalPages, setTotalPages] = useState(0);
    const loadingRef = useRef(new Set<number>());
    const forceReload = useRef(0);

    useEffect(() => {
        setCache({});
        setData([]);
        setPage(1);
        setLoading(true);
        loadingRef.current.clear();
        forceReload.current++;
    }, dependencies);

    const getData = async (pageNum: number) => {

        if (cache[pageNum]) return;

        if (loadingRef.current.has(pageNum)) return;

        loadingRef.current.add(pageNum);

        try {
            const res = await fetchFunction(pageNum, limit);

            if (res.status !== 200) {
                const alertMessage = `Error al obtener datos ${res.statusText}`;
                showAlert(alertMessage);
                setLoading(false);
                return;
            };

            setTotalPages(res.data.pagination.totalPages);
            setCache(prev => ({
                ...prev,
                [pageNum]: res.data.rows
            }));

            if (pageNum === page) {
                setData(res.data.rows);
                setLoading(false);
            }

        } catch (err) {
            const alertMessage = axios.isAxiosError(err)
                ? `Error al obtener datos: ${err.response?.data?.error || err.message}`
                : 'Error al obtener datos: Error desconocido';

            showAlert(alertMessage);
            setLoading(false);
            return;
        } finally {
            loadingRef.current.delete(pageNum);
        }
    };

    useEffect(() => {
        if (cache[page]) {
            setData(cache[page]);
            setLoading(false);
        }
    }, [page, cache]);

    useEffect(() => {

        const loadPages = async () => {
            if (!cache[page]) {
                setLoading(true);
            }

            await getData(page);

            if (page > 1) {
                getData(page - 1);
            }

            if (totalPages && page < totalPages) {
                getData(page + 1);
            }
        };

        loadPages();
    }, [page, totalPages, forceReload.current]);

    useEffect(() => {
        const pagesToKeep = new Set([
            page - 1,
            page,
            page + 1
        ].filter(p => p >= 1 && p <= totalPages));

        setCache(prev => {
            const newCache: Record<number, T[]> = {};
            pagesToKeep.forEach(p => {
                if (prev[p]) newCache[p] = prev[p];
            });
            return newCache;
        });
    }, [page, totalPages]);

    return {
        data,
        loading,
        page,
        setPage,
        totalPages
    };
};