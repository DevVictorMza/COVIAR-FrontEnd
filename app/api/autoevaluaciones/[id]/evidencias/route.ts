import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

/**
 * POST /api/autoevaluaciones/{id}/evidencias
 * Subir un archivo PDF de evidencia para un indicador
 * Body: multipart/form-data con campos 'archivo' (File) e 'id_indicador' (number)
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const formData = await request.formData()

        const cookies = request.headers.get('Cookie')
        const authHeader = request.headers.get('Authorization')

        const headers: HeadersInit = {}

        if (cookies) {
            headers['Cookie'] = cookies
        }

        if (authHeader) {
            headers['Authorization'] = authHeader
        }

        // No setear Content-Type — fetch lo genera automáticamente con el boundary para multipart
        const backendUrl = `${API_BASE_URL}/api/autoevaluaciones/${id}/evidencias`

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers,
            credentials: 'include',
            body: formData,
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
            console.error('Proxy: Error al subir evidencia:', response.status, data)
            return NextResponse.json(
                { message: data.message || `Error ${response.status}: ${response.statusText}` },
                { status: response.status }
            )
        }

        console.log('Proxy: Evidencia subida exitosamente')
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error('Proxy: Error de conexión al subir evidencia:', error)
        return NextResponse.json(
            { message: 'No se pudo conectar con el servidor backend' },
            { status: 503 }
        )
    }
}

/**
 * GET /api/autoevaluaciones/{id}/evidencias?id_indicador=X
 * Obtener la evidencia de un indicador
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { searchParams } = new URL(request.url)
        const idIndicador = searchParams.get('id_indicador')

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

        let backendUrl = `${API_BASE_URL}/api/autoevaluaciones/${id}/evidencias`
        if (idIndicador) {
            backendUrl += `?id_indicador=${idIndicador}`
        }

        const response = await fetch(backendUrl, {
            method: 'GET',
            headers,
            credentials: 'include',
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
            return NextResponse.json(
                { message: data.message || `Error ${response.status}: ${response.statusText}` },
                { status: response.status }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Proxy: Error de conexión al obtener evidencias:', error)
        return NextResponse.json(
            { message: 'No se pudo conectar con el servidor backend' },
            { status: 503 }
        )
    }
}

/**
 * DELETE /api/autoevaluaciones/{id}/evidencias?id_indicador=X
 * Eliminar la evidencia de un indicador
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { searchParams } = new URL(request.url)
        const idIndicador = searchParams.get('id_indicador')

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

        let backendUrl = `${API_BASE_URL}/api/autoevaluaciones/${id}/evidencias`
        if (idIndicador) {
            backendUrl += `?id_indicador=${idIndicador}`
        }

        const response = await fetch(backendUrl, {
            method: 'DELETE',
            headers,
            credentials: 'include',
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
            return NextResponse.json(
                { message: data.message || `Error ${response.status}: ${response.statusText}` },
                { status: response.status }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Proxy: Error de conexión al eliminar evidencia:', error)
        return NextResponse.json(
            { message: 'No se pudo conectar con el servidor backend' },
            { status: 503 }
        )
    }
}
