'use client';
import { useEffect, useState } from 'react';
import { useDepartamentoStore } from '@/app/lib/stores/useDepartamentoStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DepartamentoDetailPage({ params }: { params: { id: string } }) {
    const { getDepartamento, updateDepartamento, loading, error } = useDepartamentoStore();
    const [departamento, setDepartamento] = useState({
        nombre: '',
        descripcion: '',
        activo: true,
    });
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            const data = await getDepartamento(Number(params.id));
            setDepartamento(data);
        };
        loadData();
    }, [params.id, getDepartamento]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateDepartamento(Number(params.id), departamento);
            router.push('/departamentos');
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setDepartamento({
            ...departamento,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Editar Departamento</h1>
            <form onSubmit={handleSubmit} className="max-w-md space-y-4">
                <div>
                    <label className="block mb-1">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        value={departamento.nombre}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1">Descripción</label>
                    <textarea
                        name="descripcion"
                        value={departamento.descripcion}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        rows={3}
                    />
                </div>
                <div>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="activo"
                            checked={departamento.activo}
                            onChange={handleChange}
                            className="p-2 border rounded"
                        />
                        <span>Activo</span>
                    </label>
                </div>
                <div className="flex space-x-2">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                    <Link
                        href="/departamentos"
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
    );
}