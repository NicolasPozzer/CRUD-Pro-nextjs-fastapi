import { NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // URL de tu API FastAPI

export async function GET() {
    try {
        const response = await axios.get(`${API_BASE_URL}/departamentos`);
        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al obtener departamentos' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const response = await axios.post(`${API_BASE_URL}/departamentos`, data);
        return NextResponse.json(response.data, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al crear departamento' },
            { status: 500 }
        );
    }
}