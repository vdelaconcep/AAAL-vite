import { check } from 'express-validator';

export const comisionValidator = [
    check("presidente")
        .notEmpty().withMessage("Debe ingresar nombre del presidente")
        .bail()
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage("El nombre del presidente debe tener entre 3 y 50 caracteres"),
    
    check("vicepresidente")
        .notEmpty().withMessage("Debe ingresar nombre del vicepresidente")
        .bail()
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage("El nombre del vicepresidente debe tener entre 3 y 50 caracteres"),
    
    check("secretario")
        .notEmpty().withMessage("Debe ingresar nombre del secretario")
        .bail()
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage("El nombre del secretario debe tener entre 3 y 50 caracteres"),
    
    check("prosecretario")
        .notEmpty().withMessage("Debe ingresar nombre del prosecretario")
        .bail()
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage("El nombre del prosecretario debe tener entre 3 y 50 caracteres"),
    
    check("tesorero")
        .notEmpty().withMessage("Debe ingresar nombre del tesorero")
        .bail()
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage("El nombre del tesorero debe tener entre 3 y 50 caracteres"),
    
    check("protesorero")
        .notEmpty().withMessage("Debe ingresar nombre del protesorero")
        .bail()
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage("El nombre del protesorero debe tener entre 3 y 50 caracteres"),
    
    check('vocalesTitulares')
        .isArray({ min: 1 })
        .withMessage('Debe haber al menos un vocal titular'),
    check('vocalesTitulares.*')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('El nombre de los vocales debe tener entre 3 y 50 caracteres'),
    
    check('vocalesSuplentes')
        .isArray()
        .withMessage('Debe haber al menos un vocal suplente'),
    check('vocalesSuplentes.*')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('El nombre de los vocales debe tener entre 3 y 50 caracteres'),
    
    check('revisoresDeCuentas')
        .isArray()
        .withMessage('Debe haber al menos un revisor de cuentas'),
    check('revisoresDeCuentas.*')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('El nombre de los revisores de cuentas debe tener entre 3 y 50 caracteres'),
    
    check('fromDate').isDate(),
    check('toDate').optional().isDate(),
];