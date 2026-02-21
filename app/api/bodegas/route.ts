import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

/**
 * GET /api/bodegas
 * Obtiene la lista de todas las bodegas (solo para admin)
 */
export async function GET(request: NextRequest) {
    try {
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

        const response = await fetch(`${API_BASE_URL}/api/admin/bodegas`, {
            method: 'GET',
            headers,
            credentials: 'include',
        })

        const data = await response.json().catch(() => [])

        if (!response.ok) {
            console.error('Proxy: Error al obtener bodegas:', response.status, data)
            return NextResponse.json(
                { message: data.message || `Error ${response.status}: ${response.statusText}` },
                { status: response.status }
            )
        }

        return NextResponse.json(data, { status: 200 })
    } catch (error) {
        console.error('Proxy: Error de conexión al obtener bodegas:', error)
        return NextResponse.json(
            { message: 'No se pudo conectar con el servidor backend' },
            { status: 503 }
        )
    }
}
