import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from 'yup';
import InputError from "@/components/ui/inputError";
import MainButton from "@/components/buttons/mainButton";

interface SearchByDateProps{
    onSearch: (from: string, to: string) => void
    addClass?: string
}

export default function SearchByDate({onSearch, addClass}: SearchByDateProps) {

    const validationSchema = Yup.object({
        fromDate: Yup
            .string()
            .matches(
                /^\d{4}-\d{2}-\d{2}$/,
                'La fecha debe tener el formato YYYY-MM-DD'
            )
            .test('es-fecha-valida', 'La fecha no es válida', (value) => {
                if (!value) return false;
                const date = new Date(value);
                return !isNaN(date.getTime());
            })
            .required('La fecha "desde" es obligatoria'),

        toDate: Yup
            .string()
            .matches(
                /^\d{4}-\d{2}-\d{2}$/,
                'La fecha debe tener el formato YYYY-MM-DD'
            )
            .test('es-fecha-valida', 'La fecha no es válida', (value) => {
                if (!value) return false;
                const date = new Date(value);
                return !isNaN(date.getTime());
            })
            .test(
                'fecha-posterior',
                'La fecha "hasta" debe ser posterior a la fecha "desde"',
                function (value: string | undefined) {
                    const { fromDate } = this.parent;
                    if (!fromDate || !value) return true;
                    return new Date(value) >= new Date(fromDate);
                }
            )
            .required('La fecha "hasta" es obligatoria')
    });

    const { register, handleSubmit, formState: { errors }} = useForm({
            resolver: yupResolver(validationSchema)
    });
    
    const onSubmit = (data: {
        fromDate: string,
        toDate: string
    }) => {
        onSearch(data.fromDate, data.toDate);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={`w-full sm:max-w-sm bg-gradient-to-bl from-[#6B9795] to-[#8fc9c5] p-2 pb-3 border-2 border-gray-500 rounded-xl overflow-hidden ${addClass && addClass} shadow-sm shadow-gray-500`}>
                <div className="flex sm:gap-2 mb-5">
                    <article className="flex flex-col w-1/2 pr-1 sm:pr-0">
                        <label
                            className="text-black ml-1 mb-1"
                            htmlFor="fromDate">Desde:</label>
                        <input
                            {...register("fromDate")}
                            id="fromDate"
                            className={`block bg-[#bac7ad] focus:bg-amber-50  border-[1px] rounded-md px-2 py-1 text-sm w-full ${errors.fromDate ? 'border-red-600' : 'border-[#858f7b]'}`}
                            type="date"
                            placeholder="Fecha"/>
                            {errors.fromDate && <InputError errorMessage={errors.fromDate.message || "Fecha no válida"} />}
                    </article>
                    <article className="flex flex-col w-1/2 pl-1 sm:pl-0">
                        <label
                        className="text-black ml-1 mb-1"
                            htmlFor="toDate">Hasta:</label>
                        <input
                            {...register("toDate")}
                            id="toDate"
                            className={`block bg-[#bac7ad] focus:bg-amber-50  border-[1px] rounded-md px-2 py-1 text-sm w-full ${errors.toDate ? 'border-red-600' : 'border-[#858f7b]'}`}
                            type="date"
                            placeholder="Fecha"/>
                            {errors.toDate && <InputError errorMessage={errors.toDate.message || "Fecha no válida"} />}
                    </article>
                </div>
                    <MainButton
                        type='submit'
                        text='Buscar'
                        addClass='rounded-md w-full py-2 text-lg' />
        </form>
)
};