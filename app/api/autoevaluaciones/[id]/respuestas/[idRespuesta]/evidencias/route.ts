import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

/**
 * POST /api/autoevaluaciones/{id}/respuestas/{idRespuesta}/evidencias
 * Subir un archivo PDF de evidencia para una respuesta
 * Body: multipart/form-data con campo 'file' (File)
 * 
 * Proxy transparente: reenvía el body raw con su Content-Type original
 * para preservar el boundary del multipart/form-data.
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; idRespuesta: string }> }
) {
    try {
        const { id, idRespuesta } = await params

        // Leer el body como bytes crudos para no corromper el multipart
        const rawBody = await request.arrayBuffer()
        const contentType = request.headers.get('Content-Type')

        const cookies = request.headers.get('Cookie')
        const authHeader = request.headers.get('Authorization')

        const headers: HeadersInit = {}

        // Reenviar el Content-Type original (incluye el boundary del multipart)
        if (contentType) {
            headers['Content-Type'] = contentType
        }

        if (cookies) {
            headers['Cookie'] = cookies
        }

        if (authHeader) {
            headers['Authorization'] = authHeader
        }

        const backendUrl = `${API_BASE_URL}/api/autoevaluaciones/${id}/respuestas/${idRespuesta}/evidencias`
        console.log(`Proxy evidencias: POST ${backendUrl} (${rawBody.byteLength} bytes)`)

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers,
            credentials: 'include',
            body: rawBody,
        })

        const responseText = await response.text()
        let data: Record<string, unknown> = {}
        try {
            data = JSON.parse(responseText)
        } catch {
            data = { rawResponse: responseText }
        }

        if (!response.ok) {
            console.error('❌ Proxy evidencias: Error', response.status)
            console.error('   Backend URL:', backendUrl)
            console.error('   File size:', rawBody.byteLength, 'bytes')
            console.error('   Response data:', JSON.stringify(data))
            console.error('   Content-Type:', contentType)
            
            // Mensaje de error más descriptivo
            let errorMessage = data.message || data.error || `Error ${response.status}: ${response.statusText}`
            
            if (response.status === 500) {
                errorMessage = data.message || 'error interno del servidor'
                console.error('   ⚠️  Error 500 del backend - revisar logs del servidor')
            }
            
            return NextResponse.json(
                { message: errorMessage },
                { status: response.status }
            )
        }

        console.log('Proxy evidencias: Subida exitosa para respuesta', idRespuesta)
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error('Proxy evidencias: Error de conexión:', error)
        return NextResponse.json(
            { message: 'No se pudo conectar con el servidor backend' },
            { status: 503 }
        )
    }
}

/**
 * GET /api/autoevaluaciones/{id}/respuestas/{idRespuesta}/evidencias
 * Obtener las evidencias de una respuesta
 */
export async function GET(
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

        const backendUrl = `${API_BASE_URL}/api/autoevaluaciones/${id}/respuestas/${idRespuesta}/evidencias`
        console.log(`📋 Proxy evidencias: GET ${backendUrl}`)

        const response = await fetch(backendUrl, {
            method: 'GET',
            headers,
            credentials: 'include',
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
            console.error(`❌ Proxy evidencias: GET Error ${response.status}`, data)
            return NextResponse.json(
                { message: data.message || `Error ${response.status}: ${response.statusText}` },
                { status: response.status }
            )
        }

        console.log(`✅ Proxy evidencias: GET exitoso para respuesta ${idRespuesta}`, JSON.stringify(data))
        return NextResponse.json(data)
    } catch (error) {
        console.error('❌ Proxy: Error de conexión al obtener evidencias:', error)
        return NextResponse.json(
            { message: 'No se pudo conectar con el servidor backend' },
            { status: 503 }
        )
    }
}

/**
 * DELETE /api/autoevaluaciones/{id}/respuestas/{idRespuesta}/evidencias
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

        const backendUrl = `${API_BASE_URL}/api/autoevaluaciones/${id}/respuestas/${idRespuesta}/evidencias`

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
