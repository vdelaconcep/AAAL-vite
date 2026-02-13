import type { Request, Response } from 'express';
import type { NewEventDataBody, UpdateEventDataBody, Photo, Event } from '../types/galleryTypes.js';
import Gallery from "../models/galleryModel.js";
import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function createEvent(req: Request<{}, {}, NewEventDataBody, {}>, res: Response) {

    const { eventName, date, description } = req.body;

    if (!eventName || !date) return res.status(400).json({ error: 'Nombre del evento y fecha son obligatorios' });

    const files = req.files as Express.Multer.File[]

    if (!files || files.length === 0) return res.status(400).json({ error: 'Se debe publicar al menos una foto para el evento' })
    
    let arrayPhotos = [];

    try {
        const uploadPromises = files.map(file =>
            cloudinary.uploader.upload(file.path, {
                resource_type: "image",
                folder: "eventos_galeria",
                transformation: [
                    { width: 1920, crop: "limit" },
                    { quality: "auto:good" }
                ]
            })
        );

        const results = await Promise.all(uploadPromises);

        arrayPhotos = results.map(result => ({
            url: result.secure_url,
            publicId: result.public_id
        }));
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        return res.status(500).json({ error: `Error al subir imágenes a Cloudinary: ${errorMessage}` });
    }

    const event = {
        eventName,
        date,
        description,
        photos: arrayPhotos
    }

    try {
        const result = await Gallery.newEvent(event);

        return res.status(200).json(result)
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        return res.status(500).json({ error: errorMessage });
    }
}

export async function updateEvent(
    req: Request<{ eventId: string }, {}, UpdateEventDataBody>,
    res: Response) {
    const { eventName, date, description} = req.body;
    const { eventId } = req.params;

    if (!eventId) return res.status(400).json({ error: 'Se debe indicar el id del evento a modificar' });

    if (!eventName && !date && !description) return res.status(400).json({ error: 'No se enviaron modificaciones para realizar al evento' });

    try {
        const result = await Gallery.setEvent(eventId, eventName, date, description);

        return res.status(200).json(result);

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        return res.status(500).json({ error: errorMessage });
    }
}

export async function appendPhotos(req: Request<{eventId: string}>, res: Response) {

    const { eventId } = req.params;

    const files = req.files as Express.Multer.File[]

    if (!files || files.length === 0) {
        return res.status(400).json({
            error: "Se debe adjuntar al menos una foto"
        });
    }

    if (!eventId) return res.status(400).json({ error: "Se debe indicar el evento al que se desean añadir fotos" });

    let arrayPhotos = [];

    try {
        const uploadPromises = files.map(file =>
            cloudinary.uploader.upload(file.path, {
                resource_type: "image",
                folder: "eventos_galeria",
                transformation: [
                    { width: 1920, crop: "limit" },
                    { quality: "auto:good" }
                ]
            })
        );

        const results = await Promise.all(uploadPromises);

        arrayPhotos = results.map(result => ({
            url: result.secure_url,
            publicId: result.public_id
        }));

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        return res.status(500).json({ error: `Error al subir imágenes a Cloudinary: ${errorMessage}` });
    }

    try {
        const result = await Gallery.addPhotos(eventId, arrayPhotos);

        return res.status(200).json(result)

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        return res.status(500).json({ error: errorMessage });
    }
}

export async function addPhotoDescription(req: Request<
    { photoId: string },
    {},
    { description: string }>,
    res: Response) {
    const { photoId } = req.params;
    const { description } = req.body;

    if (!photoId) return res.status(400).json({
        error: "Se debe indicar el id de la foto para la que se desea guardar la descripción"
    });

    if (!description) return res.status(400).json({
        error: "Se debe enviar una descripción para la foto"
    });

    try {
        const result = await Gallery.setPhotoDescription(photoId, description);

        return res.status(200).json(result);

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        return res.status(500).json({ error: errorMessage });
    }
}

export async function getPhotos(req:
    Request<
        { photoId?: string },
        {},
        {},
        { page?: string, limit?: string, from?: string, to?: string }>,
    res: Response) {

    const { photoId } = req.params;

    const { from, to, page, limit } = req.query;
    const pageInt = page? (parseInt(page) || 1) : 1;
    const limitInt = limit ? (parseInt(limit) || 21) : 21;

    let result = null;

    try {
        if (photoId) {
            result = await Gallery.getPhotos(pageInt, limitInt, photoId, null, null);
        } else if (from || to) {
            result = await Gallery.getPhotos(pageInt, limitInt, null, from, to);
        } else result = await Gallery.getPhotos(pageInt, limitInt, null, null, null);

        if (!result) return res.status(404).json({ error: 'No se encontró información de la/las foto/s solicitada/s' });

        return res.status(200).json(result);

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        return res.status(500).json({ error: errorMessage });
    }
};

export async function getEvents(req:
    Request<
        { eventId?: string },
        {},
        {},
        { page?: string, limit?: string, from?: string, to?: string }>, res: Response) {
    const { eventId } = req.params;

    const { page, limit, from, to } = req.query;
    const pageInt = page ? (parseInt(page) || 1) : 1;
    const limitInt = limit ? (parseInt(limit) || 11) : 11;

    let result = null;

    try {
        if (eventId) {
            result = await Gallery.getEventById(eventId);
        } else if (from || to) {
            result = await Gallery.getEventsByDate(pageInt, limitInt, from, to);
        } else result = await Gallery.getEventsByDate(pageInt, limitInt, null, null);

        if (!result) return res.status(404).json({ error: 'No se encontró información de el/los evento/s solicitado/s' });

        return res.status(200).json(result);

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        return res.status(500).json({ error: errorMessage });
    }
}

export async function deleteEvent(req: Request<{ eventId: string }>, res: Response) {
    
    const { eventId } = req.params;

    if (!eventId) return res.status(400).json({
        error: "Se debe indicar el id el evento que se desea eliminar"
    });

    try {
        const eventToDelete = await Gallery.getEventById(eventId);

        if (!eventToDelete.success) return res.status(404).json({ error: eventToDelete.message });


        const photosToDelete = eventToDelete.photos || [];

        if (photosToDelete.length > 0) {
            const deletePromises = photosToDelete.map(photo => cloudinary.uploader.destroy(photo.cloudinary_public_id, {
                resource_type: "image"
            }).catch(err => null));

            await Promise.all(deletePromises);
        }

        const result = await Gallery.deleteEventById(eventId);

        return res.status(200).json(result)

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        return res.status(500).json({ error: errorMessage });
    }
}

export async function deletePhotos(req: Request<
    {}, {}, { photosIds: string[] }>, res: Response) {

    const { photosIds } = req.body;

    if (!photosIds || photosIds.length === 0) {
        return res.status(400).json({ error: 'No se ingresaron los id de las fotos a eliminar' });
    };

    let publicIds = [];
    let cloudinaryResults = [];

    try {
        publicIds = await Gallery.getPublicId(photosIds);

        if (publicIds.length > 0) {
            const deletePromises = publicIds.map(publicId => cloudinary.uploader.destroy(publicId, {
                resource_type: "image"
            }));

            cloudinaryResults = await Promise.all(deletePromises);
        }

        const result = await Gallery.deletePhotosById(photosIds);

        return res.status(200).json({
            ...result,
            cloudinary: cloudinaryResults
        });

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        return res.status(500).json({ error: errorMessage });
    }
}