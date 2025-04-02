import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // URL de tu API FastAPI

export async function GET() {
    const response = await fetch(`${API_BASE_URL}/departamentos`, {
        method: 'GET',
        headers: {
            'api_key': `{process.env.NEXT_PUBLIC_BACKEND_APIKEY}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Backend response:', data);

    return NextResponse.json(data);
}

export async function POST(req: Request) {
    try {
        const data_request = await req.json();
        console.log(data_request);

        if (!data_request) {
            return new NextResponse('Invalid data', { status: 400 });
        }

        const response = await fetch(`{process.env.NEXT_PUBLIC_BACKEND_URL}/departamentos`, {
            method: 'POST',
            headers: {
                'api_key': `${process.env.NEXT_PUBLIC_BACKEND_APIKEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data_request)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data_response = await response.json();
        console.log('Backend response:', data_response);

        return NextResponse.json(data_response, { status: 201 });

    } catch (error) {
        console.error('Error creating department:', error);

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}