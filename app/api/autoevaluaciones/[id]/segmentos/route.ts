import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        console.log('Proxy Autoevaluacion: Obteniendo segmentos para ID', id)

        // Reenviar todas las cookies del cliente al backend
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

        const backendUrl = `${API_BASE_URL}/api/autoevaluaciones/${id}/segmentos`

        const response = await fetch(backendUrl, {
            method: 'GET',
            headers,
            credentials: 'include',
        })

        const contentType = response.headers.get('content-type')
        let data

        if (contentType && contentType.includes('application/json')) {
            data = await response.json().catch(() => ({}))
        } else {
            const text = await response.text()
            data = { message: text || `Error ${response.status}` }
        }

        if (!response.ok) {
            return NextResponse.json(
                { message: data.message || `Error ${response.status}` },
                { status: response.status }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Proxy Autoevaluacion: Error de conexión:', error)
        return NextResponse.json(
            { message: 'No se pudo conectar con el servidor backend' },
            { status: 503 }
        )
    }
}
