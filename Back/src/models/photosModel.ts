import pool from '../config/mysql.js';
import { v4 as uuidv4 } from 'uuid';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

type NewEventData = {
    eventName: string,
    date: string,
    photos: { url: string, publicId: string }[],
    description: string
}

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

class PhotoGallery {
    static async newEvent(data: NewEventData) {
        
        const MAX_PHOTOS = 20;
        const photoArray = data.photos;

        // Comprobaciones
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
            CREATE TABLE photoGallery (
                id CHAR(36) NOT NULL PRIMARY KEY,
                event_id CHAR(36) NOT NULL,
                url VARCHAR(1000) NOT NULL,
                description VARCHAR(140),
                order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                modified_at TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
                cloudinary_public_id VARCHAR(255) NOT NULL,
                CONSTRAINT fk_photo_event
                FOREIGN KEY (event_id) REFERENCES eventGallery(id) ON DELETE CASCADE,
                INDEX idx_order (event_id, order)
            )`;
            await connection.query(photoCreationQuery);
            console.log("Tabla 'photoGallery' creada ✅");

            const eventId = uuidv4();

            const insertQueryEvent = `
                INSERT INTO eventosGaleria (id, event_name, date, description)
                VALUES(?, ?, ?, ?)
            `;

            const eventValues = [eventId, data.eventName, data.date, data.description];
            await connection.query(insertQueryEvent, eventValues);

            const insertQueryFotos = `
                INSERT INTO photoGallery (id, event_id, url, order, cloudinary_public_id)
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
                INSERT INTO photoGallery (id, event_id, url, order, cloudinary_public_id)
                VALUES ?
            `;

            const [result] = await connection.query<ExistsQuery[]>(
                'SELECT EXISTS(SELECT 1 FROM eventGallery WHERE id = ?) as exists',
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
                'SELECT COALESCE(MAX(order), 0) as maxOrder FROM photoGallery WHERE event_id = ?',
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
                f.id,
                f.url,
                f.description,
                f.order,
                f.created_at,
                f.modified_at,
                f.event_id,
                e.event_name as event,
                e.date as date
            FROM photoGallery f
            INNER JOIN eventGallery e ON f.event_id = e.id
        `;

            let params = [];
            let conditions = [];

            if (photoId) {
                conditions.push('f.id = ?');
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
                    FROM photoGallery f
                    INNER JOIN eventGallery e ON f.event_id = e.id
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

    static async getEvent(eventId: string) {

        if (!eventId) {
            throw new Error('Se debe indicar el id del evento');
        }

        try {
            const [eventResult] = await pool.query<ResultSetHeader[]>(
                'SELECT id, name, date, description, created_at, modified_at FROM eventGallery WHERE id=?',
                [eventId]
            );

            if (eventResult.length === 0) {
                return {
                    success: false,

                }
            }
            
            const [photosResult] = await pool.query(
                'SELECT id, url, description, order, created_at, modified_at, cloudinary_public_id FROM photoGallery WHERE event_id=?',
                [eventId]
            );

            

            return {
                success: true,
                ...evento[0],
                fotos: rows
            }
        } catch (error) {
            throw new Error('Error al obtener información del evento desde la base de datos: ' + error.message)
        }
    }

    static async getEventos(fechaDesde = null, fechaHasta = null, page = 1, limit = 11) {

        if (!page || !limit || page < 1 || limit < 1) {
            throw new Error('Se requieren parámetros válidos de paginación (page y limit)');
        }

        if ((fechaDesde && !fechaHasta) || (!fechaDesde && fechaHasta)) {
            throw new Error('Debe ingresar ambas fechas (desde y hasta) para filtrar por rango');
        }

        try {
            let query = `
            SELECT 
                e.id,
                e.nombre,
                e.fecha,
                e.descripcion,
                e.created_by,
                e.created_at,
                e.modified_by,
                e.modified_at,
                f.url as foto_url,
                COALESCE(foto_count.total_fotos, 0) as total_fotos
            FROM eventosGaleria e
            LEFT JOIN fotosGaleria f ON e.id = f.id_evento
                AND f.orden = (
                    SELECT MIN(orden)
                    FROM fotosGaleria
                    WHERE id_evento = e.id
                )
            LEFT JOIN (
                SELECT id_evento, COUNT(*) as total_fotos
                FROM fotosGaleria
                GROUP BY id_evento
            ) foto_count ON e.id = foto_count.id_evento
        `;

            let params = [];
            let conditions = '';

            if (fechaDesde && fechaHasta) {
                if (!this.fechasValidas(fechaDesde, fechaHasta)) throw new Error('Deben ingresarse fechas válidas');

                conditions += 'e.fecha >= ? AND e.fecha <= ?';
                params.push(fechaDesde, fechaHasta);

                if (conditions.length > 0) query += ' WHERE ' + conditions;
            }

            const offset = (page - 1) * limit;
            params.push(limit, offset);

            query += ' ORDER BY e.fecha DESC LIMIT ? OFFSET ?';

            // Armado de query para datos de paginación

            let queryTotal = 'SELECT COUNT(*) as total FROM eventosGaleria e';

            let paramsTotal = [];

            if (conditions.length > 0) {
                queryTotal += ' WHERE ' + conditions;

                if (fechaDesde && fechaHasta) {
                    paramsTotal.push(fechaDesde, fechaHasta);
                }
            }

            const [totalResult] = await pool.query(queryTotal, paramsTotal);
            const total = totalResult[0].total;
            const totalPages = Math.ceil(total / limit);

            const [rows] = await pool.query(query, params);

            return {
                success: true,
                rows,
                paginacion: {
                    currentPage: page,
                    totalPages,
                    totalItems: total,
                    itemsPerPage: limit
                }
            };

        } catch (error) {
            throw new Error('Error al obtener eventos: ' + error.message);
        }
    }

    static async deleteEventoGaleria(eventoId) {
        // Comprobaciones
        if (!eventoId) {
            throw new Error('Se debe indicar el id del evento');
        }
        const existe = await this.existe('evento', eventoId);
        if (!existe) {
            throw new Error(`El evento con ID ${eventoId} no existe`);
        }

        try {

            const queryEvento = 'DELETE FROM eventosGaleria WHERE id = ?'
            await pool.query(queryEvento, [eventoId]);

            return {
                success: true,
                message: 'El evento y las fotos han sido eliminados de la base de datos'
            }
        } catch (error) {
            throw new Error('Error al eliminar el evento de la base de datos: ' + error.message)
        }
    }

    static async deleteFotosGaleria(fotosIds) {

        if (!fotosIds || fotosIds.length === 0) {
            throw new Error('No se enviaron fotos para eliminar');
        }

        try {
            // Eliminar múltiples fotos
            const [result] = await pool.query(
                'DELETE FROM fotosGaleria WHERE id IN (?)',
                [fotosIds]
            );

            if (result.affectedRows === 0) {
                throw new Error('No se encontraron fotos con los IDs proporcionados');
            }

            if (result.affectedRows < fotosIds.length) {
                return {
                    success: true,
                    message: `Eliminadas ${result.affectedRows} de ${fotosIds.length} solicitudes`,
                    warning: 'Algunos IDs no existían en la base de datos',
                    eliminadas: result.affectedRows,
                    solicitadas: fotosIds.length
                };
            }

            return {
                success: true,
                message: `Eliminadas ${fotosIds.length} fotos`
            };
        } catch (error) {
            throw new Error('Error al eliminar fotos: ' + error.message);
        };
    }
};

export default FotosGaleria;