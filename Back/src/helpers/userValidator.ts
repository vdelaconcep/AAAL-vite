import { check } from 'express-validator';

export const registerValidator = [
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
    check("password")
        .notEmpty().withMessage("Debe ingresar una contraseña")
        .bail()
        .isLength({ min: 6, max: 128 }).withMessage("La contraseña debe tener entre 6 y 128 caracteres")
        .bail()
        .matches(/^[a-zA-Z0-9]+$/).withMessage("La contraseña solo puede contener letras y números")
]

export const loginValidator = [
    check("email")
        .notEmpty().withMessage("Debe escribir una dirección de e-mail")
        .bail()
        .isEmail().withMessage("Debe ingresar una dirección de e-mail válida"),
    check("password")
        .notEmpty().withMessage("Debe ingresar una contraseña")
];