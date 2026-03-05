import { Oval } from 'react-loader-spinner';

interface LoadingComponentProps {
    isLoading: boolean
    addClass?: string
}

export default function LoadingComponent({ isLoading, addClass }: LoadingComponentProps) {
    return (isLoading ?
        <article className={`flex flex-col items-center justify-center h-full py-10 ${addClass || ''}`}>
            <Oval
                height={80}
                width={80}
                color="#6E1538"
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#704858"
                strokeWidth={4}
                strokeWidthSecondary={4} />
            <h6 className='mt-2'>Cargando...</h6>
        </article> : null
    );
};