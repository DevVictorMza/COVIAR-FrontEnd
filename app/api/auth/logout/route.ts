import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function POST(request: NextRequest) {
    // Preparar respuesta con cookies eliminadas (siempre, incluso si backend falla)
    const cookieOptions = 'Path=/; Max-Age=0; HttpOnly; SameSite=Lax'

    try {
        console.log('Proxy Logout: Enviando logout a', `${API_BASE_URL}/api/logout`)

        const cookies = request.headers.get('Cookie')
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        }
        if (cookies) {
            headers['Cookie'] = cookies
        }

        const response = await fetch(`${API_BASE_URL}/api/logout`, {
            method: 'POST',
            headers,
        })

        const data = await response.json().catch(() => ({}))

        const nextResponse = NextResponse.json(
            response.ok ? data : { message: data.message || 'Error en logout' },
            { status: response.ok ? 200 : response.status }
        )

        // Reenviar Set-Cookie del backend (que eliminan las cookies)
        const setCookieHeaders = response.headers.getSetCookie?.() || []
        for (const cookie of setCookieHeaders) {
            nextResponse.headers.append('set-cookie', cookie)
        }

        // Si el backend no envió Set-Cookie, eliminarlas manualmente
        if (setCookieHeaders.length === 0) {
            nextResponse.headers.append('set-cookie', `auth_token=; ${cookieOptions}`)
            nextResponse.headers.append('set-cookie', `refresh_token=; ${cookieOptions}`)
        }

        console.log('Proxy Logout: Logout exitoso, cookies eliminadas')
        return nextResponse
    } catch (error) {
        console.error('Proxy Logout: Error de conexión:', error)

        // Aunque falle el backend, eliminar las cookies del navegador
        const nextResponse = NextResponse.json(
            { message: 'Backend no disponible, sesión local cerrada' },
            { status: 200 }
        )
        nextResponse.headers.append('set-cookie', `auth_token=; ${cookieOptions}`)
        nextResponse.headers.append('set-cookie', `refresh_token=; ${cookieOptions}`)

        return nextResponse
    }
}
