import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

/**
 * POST /api/bodegas/[id]/cambiar-password
 * Permite al admin cambiar directamente la contraseña de una bodega
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
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

        const response = await fetch(
            `${API_BASE_URL}/api/admin/bodegas/${id}/cambiar-password`,
            {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify(body),
            }
        )

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
            return NextResponse.json(
                { message: data.message || `Error ${response.status}: ${response.statusText}` },
                { status: response.status }
            )
        }

        return NextResponse.json(data, { status: 200 })
    } catch (error) {
        console.error('Proxy: Error al cambiar contraseña de bodega:', error)
        return NextResponse.json(
            { message: 'No se pudo conectar con el servidor backend' },
            { status: 503 }
        )
    }
}
