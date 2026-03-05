import pool from '../config/mysql.ts';
import { v4 as uuidv4 } from 'uuid';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import type { NewEventData, GetEventByIdResult, Photo, Event } from '../types/galleryTypes.js';

type PreviousQuery = {
    maxOrder: number
} & RowDataPacket

type ExistsQuery = {
    exists: number
} & RowDataPacket

type TotalQuery = {
    total: number
} & RowDataPacket

type PublicIdQuery = {
    cloudinary_public_id: string
} & RowDataPacket

export default class Gallery {
    static async newEvent(data: NewEventData) {
        
        const MAX_PHOTOS = 20;
        const photoArray = data.photos;

        if (!photoArray || photoArray.length === 0) {
            throw new Error('Error: no se enviaron fotos');
        }

        if (photoArray.length > MAX_PHOTOS) {
            throw new Error(`No se pueden agregar más de ${MAX_PHOTOS} fotos a la vez`);
        }

        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const eventCreationQuery = `
            CREATE TABLE IF NOT EXISTS eventGallery (
                id CHAR(36) NOT NULL PRIMARY KEY,
                event_name VARCHAR(60) NOT NULL,
                date DATE NOT NULL,
                description VARCHAR(140),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                modified_at TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
            )`;
            await connection.query(eventCreationQuery);
            console.log("Tabla 'eventGallery' creada ✅");

            const photoCreationQuery = `
            CREATE TABLE IF NOT EXISTS photoGallery (
                id CHAR(36) NOT NULL PRIMARY KEY,
                event_id CHAR(36) NOT NULL,
                url VARCHAR(1000) NOT NULL,
                description VARCHAR(140),
                photo_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                modified_at TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
                cloudinary_public_id VARCHAR(255) NOT NULL,
                CONSTRAINT fk_photo_event
                FOREIGN KEY (event_id) REFERENCES eventGallery(id) ON DELETE CASCADE,
                INDEX idx_order (event_id, photo_order)
            )`;
            await connection.query(photoCreationQuery);
            console.log("Tabla 'photoGallery' creada ✅");

            const eventId = uuidv4();

            const insertQueryEvent = `
                INSERT INTO eventGallery (id, event_name, date, description)
                VALUES(?, ?, ?, ?)
            `;

            const eventValues = [eventId, data.eventName, data.date, data.description];
            await connection.query(insertQueryEvent, eventValues);

            const insertQueryFotos = `
                INSERT INTO photoGallery (id, event_id, url, photo_order, cloudinary_public_id)
                VALUES ?
            `;

            const PhotoValues = photoArray.map((photo, index: number) => [
                uuidv4(),
                eventId,
                photo.url,
                index + 1,
                photo.publicId
            ]);

            await connection.query(insertQueryFotos, [PhotoValues]);

            await connection.commit();

            return {
                success: true,
                message: `Evento creado con ${photoArray.length} fotos (id del evento: ${eventId})`,
            };

        } catch (err) {
            await connection.rollback();
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            throw new Error('Error al crear evento: ' + errorMessage)
        } finally {
            connection.release();
        }
    }

    static async setEvent(
        eventId: string,
        eventName: string | null = null,
        date: string | null = null,
        description: string | null = null) {
        
        if (!eventName && !date && !description) {
            throw new Error('No se han introducido modificaciones al evento');
        }

        if (!eventId) {
            throw new Error('Debe ingresar el id del evento a modificar');
        }

        const updates = [];
        const values = [];

        if (eventName) {
            updates.push('event_name = ?');
            values.push(eventName)
        };

        if (date) {
            updates.push('date = ?');
            values.push(date)
        };

        if (description) {
            updates.push('description = ?');
            values.push(description)
        }

        values.push(eventId);

        const query = `UPDATE eventGallery SET ${updates.join(', ')} WHERE id = ?`

        try {
            const [result] = await pool.query <ResultSetHeader>(query, values);

            if (result.affectedRows === 0) {
                return {
                    success: false,
                    message: 'No se encontró el evento seleccionado'
                }
            }

            return {
                success: true,
                message: `Agregadas modificaciones al evento con ID ${eventId}`
            };

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            throw new Error('Error al modificar evento: ' + errorMessage)
        }
    };

    static async addPhotos(
        eventId: string,
        photos: { url: string, publicId: string }[]) {

        const MAX_PHOTOS = 20;

        if (!eventId) {
            throw new Error('Debe ingresar el id del evento para añadir fotos');
        }

        if (!photos || photos.length === 0) {
            throw new Error('Error: no se enviaron fotos');
        }

        if (photos.length > MAX_PHOTOS) {
            throw new Error(`No se pueden agregar más de ${MAX_PHOTOS} fotos a la vez`);
        }

        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const insertPhotosQuery = `
                INSERT INTO photoGallery (id, event_id, url, photo_order, cloudinary_public_id)
                VALUES ?
            `;

            const [result] = await connection.query<ExistsQuery[]>(
                'SELECT EXISTS(SELECT 1 FROM eventGallery WHERE id = ?) as `exists`',
                [eventId]
            );

            const eventExists = result[0].exists === 1

            if (!eventExists) {
                return {
                    success: false,
                    message: 'No se encontró el evento seleccionado'
                }
            }

            const [previous] = await connection.query <PreviousQuery[]>(
                'SELECT COALESCE(MAX(photo_order), 0) as maxOrder FROM photoGallery WHERE event_id = ?',
                [eventId]);

            const initial = previous[0].maxOrder

            const photoValues = photos.map((photo, index) => [
                uuidv4(),
                eventId,
                photo.url,
                initial + index + 1,
                photo.publicId
            ]);

            await connection.query(insertPhotosQuery, [photoValues]);

            await connection.commit();

            return {
                success: true,
                message: `Agregadas ${photos.length} fotos al evento con ID ${eventId}`,
            };

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            throw new Error('Error al añadir fotos al evento: ' + errorMessage)
        } finally {
            connection.release();
        }
    }

    static async setPhotoDescription(photoId: string, description: string) {

        if (!photoId) {
            throw new Error('Debe ingresar el id de la foto para añadir descripción');
        }

        if (!description) {
            throw new Error('Error: no se envió la descripción');
        }

        if (description.length > 140) {
            throw new Error('Error: La descripción no debe exceder los 140 caracteres');
        }

        try {
            const query = 'UPDATE photoGallery SET description = ? WHERE id = ?';

            const [result] = await pool.query<ResultSetHeader> (query, [description, photoId]);

            if (result.affectedRows === 0) {
                return {
                    success: false,
                    message: 'No se encontró la foto seleccionada'
                }
            }

            return {
                success: true,
                message: `Descripción añadida a la foto con id ${photoId}: ${description}`
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            throw new Error('Error al guardar la descripción: ' + errorMessage);
        };
    }

    static isValidDate(from: string, to: string) {
        if (!from || !to) throw new Error('Debe ingresar fechas inicial y final del rango de fechas');

        const fromDate = new Date(from);
        const toDate = new Date(to);

        if (isNaN(fromDate.getTime())) {
            throw new Error('La fecha de inicio no es válida');
        }

        if (isNaN(toDate.getTime())) {
            throw new Error('La fecha de finalización no es válida');
        }

        if (fromDate > toDate) {
            throw new Error('La fecha de inicio debe ser anterior a la fecha de finalización del rango');
        }

        return true;
    }

    static async getPhotos(
        page: number,
        limit: number,
        photoId?: string | null,
        from?: string | null,
        to?: string | null,
        ) {

        if (!photoId && (!page || !limit || page < 1 || limit < 1)) {
            throw new Error('Se requieren parámetros válidos de paginación (page y limit)');
        }

        if ((from && !to) || (!from && to)) {
            throw new Error('Debe ingresar fecha inicial y final para filtrar por rango');
        }

        try {
            let query = `
            SELECT 
                p.id,
                p.url,
                p.description,
                p.photo_order,
                p.created_at,
                p.modified_at,
                p.event_id,
                e.event_name as event,
                e.date as date
            FROM photoGallery p
            INNER JOIN eventGallery e ON p.event_id = e.id
        `;

            let params = [];
            let conditions = [];

            if (photoId) {
                conditions.push('p.id = ?');
                params.push(photoId);
            }

            if (from && to) {
                this.isValidDate(from, to);

                conditions.push('e.date >= ?');
                conditions.push('e.date <= ?');
                params.push(from, to);
            }

            if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');

            let total = 0;
            let totalPages = 0;

            if (!photoId) {
                let totalQuery = `
                    SELECT COUNT(*) as total 
                    FROM photoGallery p
                    INNER JOIN eventGallery e ON p.event_id = e.id
                `;

                let totalParams = [];
                let totalConditions = [];

                if (from && to) {
                    totalConditions.push('e.date >= ?');
                    totalConditions.push('e.date <= ?');
                    totalParams.push(from, to);
                }

                if (totalConditions.length > 0) {
                    totalQuery += ' WHERE ' + totalConditions.join(' AND ');
                }

                const [totalResult] = await pool.query<TotalQuery[]>(totalQuery, totalParams);
                total = totalResult[0].total;
                totalPages = Math.ceil(total / limit);

                query += ' ORDER BY e.date DESC LIMIT ? OFFSET ?';

                const offset = (page - 1) * limit;
                params.push(limit, offset);
            }

            const [rows] = await pool.query<RowDataPacket[]>(query, params);

            if (photoId && rows.length === 0) throw new Error('No se encontró una foto con el id ingresado')

            if (from && to && rows.length === 0) throw new Error('No se encontraron fotos para el rango de fechas ingresado')

            if (photoId) {
                return {
                    success: true,
                    rows: rows[0]
                };
            } else {
                return {
                    success: true,
                    rows,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        totalItems: total,
                        itemsPerPage: limit
                    }
                };
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            throw new Error('Error al obtener foto(s): ' + errorMessage);
        }
    }

    static async getPublicId(photoIds: string[]) {
        if (!photoIds || !Array.isArray(photoIds) || photoIds.length === 0) {
            throw new Error('Se deben enviar los id de las fotos');
        }

        try {
            const [result] = await pool.query<PublicIdQuery[]>('SELECT cloudinary_public_id FROM photoGallery WHERE id IN (?)',
                [photoIds]
            );

            return result
                .map(photo => photo.cloudinary_public_id)
                .filter(Boolean);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            throw new Error('Error al obtener cloudinary public id de las fotos: ' + errorMessage);
        }
    }

    static async getEventById(eventId: string): Promise<GetEventByIdResult> {

        if (!eventId) {
            throw new Error('Se debe indicar el id del evento');
        }

        try {
            const [eventResult] = await pool.query<RowDataPacket[]>(
                'SELECT id, event_name, date, description, created_at, modified_at FROM eventGallery WHERE id=?',
                [eventId]
            );

            if (eventResult.length === 0) {
                return {
                    success: false,
                    message: 'No se encontró un evento con el id ingresado'
                }
            }
            
            const [photosResult] = await pool.query(
                'SELECT id, url, description, photo_order, created_at, modified_at, cloudinary_public_id FROM photoGallery WHERE event_id=? ORDER BY photo_order ASC',
                [eventId]
            );

            return {
                success: true,
                ...(eventResult[0] as Event),
                photos: photosResult as Photo[]
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            throw new Error('Error al obtener evento: ' + errorMessage);
        }
    }

    static async getEventsByDate(
        page: number = 1,
        limit: number = 11,
        from?: string | null,
        to?: string | null) {

        if (!page || !limit || page < 1 || limit < 1) {
            throw new Error('Se requieren parámetros válidos de paginación (page y limit)');
        }

        if ((from && !to) || (!from && to)) {
            throw new Error('Debe ingresar ambas fechas (desde y hasta) para filtrar por rango');
        }

        try {
            let query = `
            SELECT 
                e.id,
                e.event_name,
                e.date,
                e.description,
                e.created_at,
                e.modified_at,
                p.url as photo_url,
                COALESCE(photo_count.total_photos, 0) as total_photos
            FROM eventGallery e
            LEFT JOIN photoGallery p ON e.id = p.event_id
                AND p.photo_order = (
                    SELECT MIN(photo_order)
                    FROM photoGallery
                    WHERE event_id = e.id
                )
            LEFT JOIN (
                SELECT event_id, COUNT(*) as total_photos
                FROM photoGallery
                GROUP BY event_id
            ) photo_count ON e.id = photo_count.event_id
        `;

            let params = [];
            let conditions = '';

            if (from && to) {
                if (!this.isValidDate(from, to)) throw new Error('Deben ingresarse fechas válidas');

                conditions += 'e.date >= ? AND e.date <= ?';
                params.push(from, to);

                if (conditions.length > 0) query += ' WHERE ' + conditions;
            }

            const offset = (page - 1) * limit;
            params.push(limit, offset);

            query += ' ORDER BY e.date DESC LIMIT ? OFFSET ?';

            let totalQuery = 'SELECT COUNT(*) as total FROM eventGallery e';

            let totalParams = [];

            if (conditions.length > 0) {
                totalQuery += ' WHERE ' + conditions;

                if (from && to) {
                    totalParams.push(from, to);
                }
            }

            const [totalResult] = await pool.query<TotalQuery[]>(totalQuery, totalParams);
            const total = totalResult[0].total;
            const totalPages = Math.ceil(total / limit);

            const [eventsResult] = await pool.query(query, params);

            return {
                success: true,
                events: eventsResult,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: total,
                    itemsPerPage: limit
                }
            };

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            throw new Error('Error al obtener evento: ' + errorMessage);
        }
    }

    static async deleteEventById(eventId: string) {

        if (!eventId) {
            throw new Error('Se debe indicar el id del evento');
        }

        try {

            const query = 'DELETE FROM eventGallery WHERE id = ?'
            const [result] = await pool.query<ResultSetHeader>(query, [eventId]);

            if (result.affectedRows === 0) {
                return {
                    success: false,
                    message: 'No se encontró el evento seleccionado'
                }
            }

            return {
                success: true,
                message: 'El evento y las fotos han sido eliminados'
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            throw new Error('Error al eliminar evento: ' + errorMessage);
        }
    }

    static async deletePhotosById(photosIds: string[]) {

        if (!photosIds || photosIds.length === 0) {
            throw new Error('No se enviaron fotos para eliminar');
        }

        try {
            const [result] = await pool.query<ResultSetHeader>(
                'DELETE FROM photoGallery WHERE id IN (?)',
                [photosIds]
            );

            if (result.affectedRows === 0) {
                throw new Error('No se encontraron fotos con los IDs proporcionados');
            }

            if (result.affectedRows < photosIds.length) {
                return {
                    success: true,
                    message: `Eliminadas ${result.affectedRows} de ${photosIds.length} solicitudes`,
                    warning: 'Algunos id no fueron encontrados'
                };
            }

            return {
                success: true,
                message: `Eliminadas ${photosIds.length} fotos`
            };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            throw new Error('Error al eliminar fotos: ' + errorMessage);
        };
    }
};