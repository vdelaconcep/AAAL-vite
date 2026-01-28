import { useEffect } from 'react';
import { useAlert } from '@/context/alertContext';
import Sponsors from "@/components/principal/sponsors";
import Carousel from "@/components/principal/carousel";
import Story from "@/components/principal/story"
import Map from '@/components/principal/map';
import PrincipalCars from '@/components/principal/principalCars';
import PrincipalNews from '@/components/principal/principalNews';
import Facah from '@/components/principal/facah';

export default function PrincipalComponent() {

    const { showAlert } = useAlert();

    const message = 'Atención!!! a partir del mes de Junio de 2025 nos reuniremos los días Viernes a partir de las 18:00 hs.';
    
    useEffect(() => {
        showAlert(message, { important: true });
    }, [])

    return (
        <div>
            <article>
                <Carousel />
            </article>

            <Story />

            <article className='md:flex'>
                <PrincipalNews />
                <Map />
            </article>
            
            <PrincipalCars />
            
            <Facah />
            <Sponsors />
        </div>
    );
};