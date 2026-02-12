import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

/**
 * GET /api/autoevaluaciones/{id}/respuestas/{idRespuesta}/evidencia/descargar
 * Descargar el archivo PDF de evidencia de una respuesta
 * Retorna el archivo como blob con Content-Disposition para forzar descarga
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; idRespuesta: string }> }
) {
    try {
        const { id, idRespuesta } = await params

        const cookies = request.headers.get('Cookie')
        const authHeader = request.headers.get('Authorization')

        const headers: HeadersInit = {}

        if (cookies) {
            headers['Cookie'] = cookies
        }

        if (authHeader) {
            headers['Authorization'] = authHeader
        }

        const backendUrl = `${API_BASE_URL}/api/autoevaluaciones/${id}/respuestas/${idRespuesta}/evidencia/descargar`
        console.log(`Proxy evidencia descargar: GET ${backendUrl}`)

        const response = await fetch(backendUrl, {
            method: 'GET',
            headers,
            credentials: 'include',
        })

        if (!response.ok) {
            const errorText = await response.text().catch(() => '')
            console.error('Proxy evidencia descargar: Error', response.status, errorText)
            
            return NextResponse.json(
                { message: `Error ${response.status}: No se pudo descargar la evidencia` },
                { status: response.status }
            )
        }

        // Obtener el archivo como blob
        const blob = await response.blob()
        
        // Obtener el nombre del archivo del header Content-Disposition si está disponible
        const contentDisposition = response.headers.get('Content-Disposition')
        let filename = `evidencia_${idRespuesta}.pdf`
        
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1].replace(/['"]/g, '')
            }
        }

        // Retornar el archivo como respuesta con headers apropiados
        return new NextResponse(blob, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        })
    } catch (error) {
        console.error('Proxy evidencia descargar: Error de conexión:', error)
        return NextResponse.json(
            { message: 'No se pudo conectar con el servidor backend' },
            { status: 503 }
        )
    }
}
