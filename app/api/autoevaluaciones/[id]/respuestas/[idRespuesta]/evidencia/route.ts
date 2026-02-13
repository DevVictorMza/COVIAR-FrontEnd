import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

/**
 * DELETE /api/autoevaluaciones/{id}/respuestas/{idRespuesta}/evidencia
 * Eliminar la evidencia de una respuesta
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; idRespuesta: string }> }
) {
    try {
        const { id, idRespuesta } = await params

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

        const backendUrl = `${API_BASE_URL}/api/autoevaluaciones/${id}/respuestas/${idRespuesta}/evidencia`

        console.log(`Proxy evidencia: DELETE ${backendUrl}`)

        const response = await fetch(backendUrl, {
            method: 'DELETE',
            headers,
            credentials: 'include',
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
            console.error(`Proxy evidencia: Error ${response.status}`, data)
            return NextResponse.json(
                { message: data.message || `Error ${response.status}: ${response.statusText}` },
                { status: response.status }
            )
        }

        console.log(`Proxy evidencia: Eliminada exitosamente para respuesta ${idRespuesta}`)
        return NextResponse.json(data)
    } catch (error) {
        console.error('Proxy evidencia: Error de conexión al eliminar:', error)
        return NextResponse.json(
            { message: 'No se pudo conectar con el servidor backend' },
            { status: 503 }
        )
    }
}
