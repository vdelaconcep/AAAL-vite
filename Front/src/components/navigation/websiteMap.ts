interface websiteMapObject {
    sectionTitle: string,
    sectionLink?: string, 
    subSections?: {
        subSectionTitle: string,
        subSectionLink: string
    }[]
}

export const websiteMap: websiteMapObject[] = [
    {
        sectionTitle: 'Principal',
        sectionLink: '/'
    },
    {
        sectionTitle: 'Nosotros',
        subSections: [
            {
                subSectionTitle: 'Comisión Directiva',
                subSectionLink: '/nosotros/comisiondirectiva'
            },
            {
                subSectionTitle: 'Mensajes de la Comunidad',
                subSectionLink: '/nosotros/comunidad'
            }
        ]
    },
    {
        sectionTitle: 'Novedades',
        subSections: [
            {
                subSectionTitle: 'Institucional',
                subSectionLink: '/novedades/institucional'
            },
            {
                subSectionTitle: 'Próximos Eventos',
                subSectionLink: '/novedades/eventos'
            },
            {
                subSectionTitle: 'Clasificados',
                subSectionLink: '/novedades/clasificados'
            }
        ]
    },
    {
        sectionTitle: 'Galería',
        subSections: [
            {
                subSectionTitle: 'Fotos',
                subSectionLink: '/galeria/fotos'
            },
            {
                subSectionTitle: 'Nuestros Vehículos',
                subSectionLink: '/galeria/vehiculos'
            },
            {
                subSectionTitle: 'Motores estacionarios',
                subSectionLink: '/galeria/motores'
            }
        ]
    },
    {
        sectionTitle: 'Contacto',
        sectionLink: '/contacto'
    }
]