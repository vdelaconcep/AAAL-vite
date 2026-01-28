interface websiteMapObject {
    sectionTitle: string,
    subSections?: string[]
}

export const websiteMap: websiteMapObject[] = [
    {
        sectionTitle: 'Principal'
    },
    {
        sectionTitle: 'Nosotros',
        subSections: [
            'Quiénes somos',
            'Historia',
            'Comisión Directiva',
            'Mensajes de la Comunidad'
        ]
    },
    {
        sectionTitle: 'Novedades',
        subSections: [
            'Institucional',
            'Próximos Eventos',
            'Clasificados'
        ]
    },
    {
        sectionTitle: 'Galería',
        subSections: [
            'Fotos',
            'Nuestros Vehículos',
            'Motores estacionarios'
        ]
    },
    {
        sectionTitle: 'Contacto'
    }
]