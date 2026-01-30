import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const provinciaId = searchParams.get('provincia')

        let url = `${API_BASE_URL}/api/departamentos`
        if (provinciaId) {
            url += `?provincia=${provinciaId}`
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
            return NextResponse.json(
                { message: data.message || `Error ${response.status}` },
                { status: response.status }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Proxy Departamentos: Error de conexión:', error)
        return NextResponse.json(
            { message: 'No se pudo conectar con el servidor backend' },
            { status: 503 }
        )
    }
}
