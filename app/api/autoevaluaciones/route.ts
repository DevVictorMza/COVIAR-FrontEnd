import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

/**
 * POST /api/autoevaluaciones
 * Crear una nueva autoevaluación
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        console.log('Proxy: Creando autoevaluación', body)

        const cookies = request.headers.get('Cookie')
        const authHeader = request.headers.get('Authorization')

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        }

        if (cookies) {
            headers['Cookie'] = cookies
        }

        if (authHeader) {
            headers['Authorization'] = authHeader
        }

        const response = await fetch(`${API_BASE_URL}/api/autoevaluaciones`, {
            method: 'POST',
            headers,
            credentials: 'include',
            body: JSON.stringify(body),
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
            console.error('Proxy: Error al crear autoevaluación:', response.status, data)
            return NextResponse.json(
                { message: data.message || `Error ${response.status}: ${response.statusText}` },
                { status: response.status }
            )
        }

        console.log('Proxy: Autoevaluación creada:', data)
        return NextResponse.json(data)
    } catch (error) {
        console.error('Proxy: Error de conexión:', error)
        return NextResponse.json(
            { message: 'No se pudo conectar con el servidor backend' },
            { status: 503 }
        )
    }
}
