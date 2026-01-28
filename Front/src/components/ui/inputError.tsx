
export default function InputError({ errorMessage }: {errorMessage: string }) {
    return (
        <span className="text-xs text-amber-50 bg-[rgba(0,0,0,0.3)] px-2 py-1 rounded shadow w-full mt-1"><i className="fa-solid fa-triangle-exclamation"></i> {errorMessage}</span>
    );
};