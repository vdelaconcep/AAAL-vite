import { check } from "express-validator";

export const newEventValidator = [
    check('eventName')
        .notEmpty().withMessage('Debe indicar un nombre para el evento')
        .bail()
        .trim()
        .isLength({ max: 60 }).withMessage('El nombre del evento debe tener hasta 60 caracteres'),
    check('date')
        .notEmpty().withMessage('Debe ingresar la fecha del evento')
        .bail()
        .isDate().withMessage('Debe ingresar una fecha válida para el evento'),
    check('description')
        .optional()
        .isLength({ max: 140 }).withMessage('La descripción del evento puede tener hasta 60 caracteres'),
    check("photos")
        .custom((value, { req }) => {

            if (!req.files) {
                throw new Error('Debe enviarse al menos una imagen para el evento')
            };

            const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            const maxSize = 10 * 1024 * 1024;

            for (const file of req.files) {
                if (!allowedMimes.includes(file.mimetype)) {
                    throw new Error(`Las imágenes deben estar en formato .jpg, .jpeg, .png o .webp`);
                }

                if (file.size > maxSize) {
                    throw new Error(`Las imágenes no deben superar cada una los 10 MB`);
                }
            }

            return true;
        })
];

export const updateEventValidator = [
    check('eventName')
        .optional()
        .trim()
        .isLength({ max: 60 }).withMessage('El nombre del evento debe tener hasta 60 caracteres'),
    check('date')
        .optional({ nullable: true })
        .isDate().withMessage('Debe ingresar una fecha válida para el evento'),
    check('description')
        .optional()
        .isLength({ max: 140 }).withMessage('La descripción del evento puede tener hasta 60 caracteres'),
];

export const addingPhotosValidator = [
    check("photos")
        .custom((value, { req }) => {

            if (!req.files) {
                throw new Error('Debe enviarse al menos una imagen para el evento')
            };

            const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            const maxSize = 10 * 1024 * 1024;

            for (const file of req.files) {
                if (!allowedMimes.includes(file.mimetype)) {
                    throw new Error(`Las imágenes deben estar en formato .jpg, .jpeg, .png o .webp`);
                }

                if (file.size > maxSize) {
                    throw new Error(`Las imágenes no deben superar cada una los 10 MB`);
                }
            }

            return true;
        })
];

export const addingDescriptionValidator = [
    check('description')
        .notEmpty().withMessage('Se debe enviar una descripción para añadir a la foto')
        .bail()
        .trim()
        .isLength({max: 140}).withMessage('La descripción no puede tener más de 140 caracteres')
]