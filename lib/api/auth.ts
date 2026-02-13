// lib/api/auth.ts

import type {
  LoginRequest,
  RegistroRequest,
  RegistroResponse,
  Usuario,
} from './types'

/**
 * Servicio de autenticación
 */

/**
 * Registra una nueva bodega en el sistema
 * Usa el proxy de Next.js para evitar problemas de CORS
 * POST /api/registro -> proxy -> http://localhost:8080/api/v1/registro
 */
export async function registrarBodega(data: RegistroRequest): Promise<RegistroResponse> {
  try {
    // Usar el proxy de Next.js para evitar CORS
    const response = await fetch('/api/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || `Error ${response.status}: ${response.statusText}`)
    }

    console.log('Bodega registrada:', result)
    return result
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('No se pudo conectar con el servidor')
    }
    throw error
  }
}

/**
 * Inicia sesión con email y contraseña
 * Usa el proxy de Next.js para evitar problemas de CORS
 * POST /api/auth/login -> proxy -> http://localhost:8080/api/login
 */
export async function loginUsuario(data: LoginRequest): Promise<unknown> {
  try {
    // Usar el proxy de Next.js para evitar CORS
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || result.error || `Error ${response.status}: ${response.statusText}`)
    }

    // El backend devuelve: { data: { cuenta, bodega, responsable } }
    // Extraer el objeto data que contiene toda la información del usuario
    const userData = result.data || result

    console.log('Login exitoso, datos recibidos:', userData)

    // Guardar en localStorage
    localStorage.setItem('usuario', JSON.stringify(userData))

    // Guardar tipoCuenta por separado para validación de admin
    if (userData.tipo) {
      localStorage.setItem('tipoCuenta', userData.tipo)
    }

    return userData
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('No se pudo conectar con el servidor')
    }
    throw error
  }
}

/**
 * Cierra la sesión del usuario actual
 * Llama al endpoint de logout del backend y limpia los datos locales
 */
export async function logoutUsuario(): Promise<void> {
  try {
    // Llamar al endpoint de logout del backend
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    console.log('Logout exitoso en el backend')
  } catch (error) {
    console.error('Error al hacer logout en el servidor:', error)
  } finally {
    // Siempre limpiar datos de localStorage, incluso si falla el backend
    localStorage.removeItem('usuario')
    localStorage.removeItem('token')
    localStorage.removeItem('tipoCuenta')

    // Limpiar caches de historial
    const keys = Object.keys(localStorage)
    for (const key of keys) {
      if (key.startsWith('historial_') || key.startsWith('resultados_')) {
        localStorage.removeItem(key)
      }
    }
  }
}

/**
 * Obtiene el usuario actual desde localStorage
 */
export function getUsuarioActual(): Usuario | null {
  if (typeof window === 'undefined') return null

  const usuarioStr = localStorage.getItem('usuario')
  if (!usuarioStr) return null

  try {
    return JSON.parse(usuarioStr) as Usuario
  } catch {
    return null
  }
}

/**
 * Verifica si hay un usuario autenticado
 */
export function isAuthenticated(): boolean {
  return getUsuarioActual() !== null
}

/**
 * Solicita restablecimiento de contraseña
 * Usa el proxy de Next.js para evitar problemas de CORS
 */
export async function solicitarRestablecimientoPassword(email: string): Promise<void> {
  const response = await fetch('/api/auth/recuperar-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || `Error ${response.status}: ${response.statusText}`)
  }
}

/**
 * Restablece la contraseña con un token
 * Usa el proxy de Next.js para evitar problemas de CORS
 */
export async function restablecerPassword(token: string, nuevaPassword: string): Promise<void> {
  const response = await fetch('/api/auth/restablecer-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, newPassword: nuevaPassword }),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || `Error ${response.status}: ${response.statusText}`)
  }
}

/**
 * Verifica si el token de autenticación es válido
 * (Para cuando la API implemente validación de tokens)
 */
export async function verificarToken(): Promise<boolean> {
  try {
    // TODO: Implementar cuando la API tenga endpoint de verificación
    // await api.get('/api/usuarios/verificar-token', { requiresAuth: true })
    return true
  } catch {
    return false
  }
}
