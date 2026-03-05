import express from 'express';

import {
    createEvent,
    updateEvent,
    appendPhotos,
    addPhotoDescription,
    getEvents,
    getPhotos,
    deleteEvent,
    deletePhotos
} from '../controllers/galleryController.js';

import {
    newEventValidator,
    updateEventValidator,
    addingPhotosValidator,
    addingDescriptionValidator
} from '../helpers/galleryValidator.js';

import { validationMid } from '../middlewares/validationMid.js';

import multer from 'multer';
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }
});

const router = express.Router();

router.get('/photos/:photoId', getPhotos);

router.get('/events', getEvents);
router.get('/events/:eventId', getEvents);

router.post('/events/new', upload.array('photos', 20), newEventValidator, validationMid, createEvent);

router.patch('/events/update/:eventId', updateEventValidator, validationMid, updateEvent);

router.patch('/events/add_photos/:eventId', upload.array('photos', 20), addingPhotosValidator, validationMid, appendPhotos);

router.patch('/photos/add_description/:photoId', addingDescriptionValidator, validationMid,  addPhotoDescription);

router.delete('/events/delete/:eventId', deleteEvent);

router.delete('/photos/delete', deletePhotos);

export default router;