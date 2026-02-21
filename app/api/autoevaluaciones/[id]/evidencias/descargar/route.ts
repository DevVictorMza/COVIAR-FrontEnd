import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

/**
 * GET /api/autoevaluaciones/{id}/evidencias/descargar
 * Descarga un ZIP con todas las evidencias de una autoevaluación
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const cookies = request.headers.get('Cookie')
        const authHeader = request.headers.get('Authorization')

        const headers: HeadersInit = {}

        if (cookies) {
            headers['Cookie'] = cookies
        }

        if (authHeader) {
            headers['Authorization'] = authHeader
        }

        const backendUrl = `${API_BASE_URL}/api/autoevaluaciones/${id}/evidencias/descargar`

        const response = await fetch(backendUrl, {
            method: 'GET',
            headers,
            credentials: 'include',
        })

        if (!response.ok) {
            const errorText = await response.text().catch(() => '')
            console.error('Proxy evidencias/descargar: Error', response.status, errorText)
            return NextResponse.json(
                { message: `Error ${response.status}: No se pudieron descargar las evidencias` },
                { status: response.status }
            )
        }

        const blob = await response.blob()

        const contentDisposition = response.headers.get('Content-Disposition')
        let filename = `evidencias_ae${id}.zip`

        if (contentDisposition) {
            const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
            if (match && match[1]) {
                filename = match[1].replace(/['"]/g, '')
            }
        }

        return new NextResponse(blob, {
            status: 200,
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        })
    } catch (error) {
        console.error('Proxy evidencias/descargar: Error de conexión:', error)
        return NextResponse.json(
            { message: 'No se pudo conectar con el servidor backend' },
            { status: 503 }
        )
    }
}
