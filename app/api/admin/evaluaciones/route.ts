import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function GET(request: NextRequest) {
  try {
    // Obtener cookies de la petición
    const authToken = request.cookies.get('auth_token')
    const refreshToken = request.cookies.get('refresh_token')

    // Construir header Cookie manualmente
    const cookieHeader = [
      authToken ? `auth_token=${authToken.value}` : null,
      refreshToken ? `refresh_token=${refreshToken.value}` : null,
    ].filter(Boolean).join('; ')

    // Obtener parámetros de query
    const searchParams = request.nextUrl.searchParams
    const estado = searchParams.get('estado') || ''
    const idBodega = searchParams.get('id_bodega') || ''

    // Construir URL con query params
    let url = `${API_BASE_URL}/api/admin/evaluaciones?`
    const params = new URLSearchParams()
    if (estado) params.append('estado', estado)
    if (idBodega) params.append('id_bodega', idBodega)
    url += params.toString()

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { 'Cookie': cookieHeader } : {}),
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
    console.error('Error al conectar con el backend:', error)
    return NextResponse.json(
      { message: 'No se pudo conectar con el servidor' },
      { status: 503 }
    )
  }
}
