// api/departamentos/[id]/eliminadas/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params; // Extraemos el id de params
        const response = await axios.get(`${API_BASE_URL}/departamentos/${id}/eliminadas`);
        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al obtener departamentos eliminados' },
            { status: 500 }
        );
    }
}