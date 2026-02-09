import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

/**
 * GET /api/bodegas/[id]/resultados-autoevaluacion
 * Obtener los resultados de autoevaluación de una bodega
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const cookies = request.headers.get('Cookie')

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        }

        if (cookies) {
            headers['Cookie'] = cookies
        }

        const response = await fetch(`${API_BASE_URL}/api/bodegas/${id}/resultados-autoevaluacion`, {
            method: 'GET',
            headers,
            credentials: 'include',
        })

        const data = await response.json().catch(() => ({}))

        // Siempre devolvemos la respuesta, incluso si es el error "recurso no encontrado"
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error('Proxy: Error al obtener resultados de autoevaluación:', error)
        return NextResponse.json(
            { error: 'No se pudo conectar con el servidor backend' },
            { status: 503 }
        )
    }
}
