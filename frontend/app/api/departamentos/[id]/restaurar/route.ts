// api/departamentos/[id]/restaurar/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params; // Extraemos el id de params
        const response = await axios.patch(
            `${API_BASE_URL}/departamentos/${id}/restaurar`
        );
        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al restaurar departamento' },
            { status: 500 }
        );
    }
}