import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function POST(request: NextRequest) {
    try {
        console.log('Proxy Logout: Enviando logout a', `${API_BASE_URL}/api/v1/auth/logout`)

        const response = await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
            console.error('Proxy Logout: Error del backend:', response.status, data)
            return NextResponse.json(
                { message: data.message || `Error ${response.status}: ${response.statusText}` },
                { status: response.status }
            )
        }

        console.log('Proxy Logout: Logout exitoso')
        return NextResponse.json(data)
    } catch (error) {
        console.error('Proxy Logout: Error de conexión:', error)
        return NextResponse.json(
            { message: 'No se pudo conectar con el servidor backend' },
            { status: 503 }
        )
    }
}
