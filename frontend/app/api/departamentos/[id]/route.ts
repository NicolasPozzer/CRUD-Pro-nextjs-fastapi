import { NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        const { id } = await context.params; // Aquí aplicamos el await
        const response = await axios.get(`${API_BASE_URL}/departamentos/${id}`);
        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Departamento no encontrado' },
            { status: 404 }
        );
    }
}

export async function PUT(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        const { id } = await context.params;
        const data = await request.json();
        const response = await axios.put(
            `${API_BASE_URL}/departamentos/${id}`,
            data
        );
        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al actualizar departamento' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        const { id } = await context.params;
        await axios.delete(`${API_BASE_URL}/departamentos/${id}`);
        return new Response(null, { status: 204 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al eliminar departamento' },
            { status: 500 }
        );
    }
}
