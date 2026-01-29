import { check } from 'express-validator';

export const messageValidator = [
    check("name")
        .notEmpty().withMessage("El campo 'nombre' no puede quedar vacío")
        .bail()
        .isLength({ min: 3, max: 50 }).withMessage("El nombre debe tener entre 3 y 50 caracteres"),
    check("email")
        .notEmpty().withMessage("Debe escribir una dirección de e-mail")
        .bail()
        .isEmail().withMessage("Debe ingresar una dirección de e-mail válida")
        .bail()
        .isLength({ max: 50 }).withMessage("El e-mail debe tener hasta 50 caracteres"),
    check("phone")
        .optional({ checkFalsy: true })
        .isNumeric().withMessage("Para indicar el teléfono hay que ingresar sólo números (sin espacios ni guiones)"),
    check("subject")
        .notEmpty().withMessage("Debe ingresar un asunto")
        .bail()
        .isLength({ max: 80 }).withMessage("El asunto debe tener hasta 80 caracteres"),
    check("message")
        .notEmpty().withMessage("El mensaje no puede quedar vacío")
        .bail()
        .isLength({ max: 800 }).withMessage("El mensaje debe tener hasta 800 caracteres")
]