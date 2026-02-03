import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        console.log('Proxy Restablecer Password: Enviando solicitud a', `${API_BASE_URL}/api/restablecer-password`)

        const response = await fetch(`${API_BASE_URL}/api/restablecer-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
            console.error('Proxy Restablecer Password: Error del backend:', response.status, data)
            return NextResponse.json(
                { message: data.message || `Error ${response.status}: ${response.statusText}` },
                { status: response.status }
            )
        }

        console.log('Proxy Restablecer Password: Contraseña restablecida exitosamente')
        return NextResponse.json(data)
    } catch (error) {
        console.error('Proxy Restablecer Password: Error de conexión:', error)
        return NextResponse.json(
            { message: 'No se pudo conectar con el servidor backend' },
            { status: 503 }
        )
    }
}
