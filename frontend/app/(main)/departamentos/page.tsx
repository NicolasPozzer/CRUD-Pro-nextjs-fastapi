'use client';
import { useEffect } from 'react';
import { useDepartamentoStore } from '@/app/lib/stores/useDepartamentoStore';
import Link from 'next/link';

export default function DepartamentosPage() {
    const {
        departamentos,
        loading,
        error,
        fetchDepartamentos,
        deleteDepartamento
    } = useDepartamentoStore();

    useEffect(() => {
        fetchDepartamentos();
    }, [fetchDepartamentos]);

    const handleDelete = async (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este departamento?')) {
            try {
                await deleteDepartamento(id);
                // Recargar la lista después de eliminar
                await fetchDepartamentos();
            } catch (error) {
                console.error('Error al eliminar departamento:', error);
                alert('No se pudo eliminar el departamento');
            }
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Departamentos</h1>
            <Link href="/departamentos/nuevo" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
                Crear Departamento
            </Link>
            <div className="grid gap-4">
                {departamentos.map((dep) => (
                    <div key={dep.id} className="border p-4 rounded">
                        <h2 className="text-xl font-semibold">{dep.nombre}</h2>
                        <p>{dep.descripcion}</p>
                        <p>Estado: {dep.activo ? 'Activo' : 'Inactivo'}</p>
                        <div className="mt-2 space-x-2">
                            <Link href={`/departamentos/${dep.id}`} className="text-blue-500">
                                Editar
                            </Link>
                            <button
                                onClick={() => handleDelete(dep.id!)}
                                className="text-red-500 hover:text-red-700"
                                disabled={loading}
                            >
                                {loading ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}