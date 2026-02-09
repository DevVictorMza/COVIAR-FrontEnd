// lib/api/autoevaluacion.ts

import type { EstructuraAutoevaluacionResponse, Segmento, CrearAutoevaluacionResponse, RespuestaIndicador, AutoevaluacionHistorial, ResultadoDetallado, ResultadosAutoevaluacionResponse } from './types'

/**
 * Servicios de API para autoevaluaciones
 * Usa el proxy de Next.js para evitar problemas de CORS
 */

/**
 * Helper para obtener headers con autenticación
 */
function getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    }
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }
    return headers
}

/**
 * Respuesta extendida de crearAutoevaluacion que incluye el status HTTP
 */
export interface CrearAutoevaluacionResult {
    httpStatus: number
    data: CrearAutoevaluacionResponse
}

/**
 * Crea una nueva autoevaluación para una bodega o retorna la pendiente
 * @param idBodega - ID de la bodega
 * @returns Objeto con httpStatus (201=nueva, 200=pendiente) y data con la autoevaluación
 */
export async function crearAutoevaluacion(idBodega: number): Promise<CrearAutoevaluacionResult> {
    const response = await fetch('/api/autoevaluaciones', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ id_bodega: idBodega }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok && response.status !== 200 && response.status !== 201) {
        throw new Error(data?.message || `Error ${response.status}: ${response.statusText}`)
    }

    return {
        httpStatus: response.status,
        data: data as CrearAutoevaluacionResponse
    }
}

/**
 * Obtiene la estructura de la autoevaluación (capítulos, indicadores, niveles)
 * Usa el proxy: /api/autoevaluaciones/{id}/estructura -> backend
 * @param idAutoevaluacion - ID de la autoevaluación
 */
export async function obtenerEstructuraAutoevaluacion(
    idAutoevaluacion: string | number
): Promise<EstructuraAutoevaluacionResponse> {
    const response = await fetch(`/api/autoevaluaciones/${idAutoevaluacion}/estructura`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(data?.message || `Error ${response.status}: ${response.statusText}`)
    }

    return data as EstructuraAutoevaluacionResponse
}

/**
 * Obtiene los segmentos disponibles para una autoevaluación
 * @param idAutoevaluacion - ID de la autoevaluación
 */
export async function obtenerSegmentos(
    idAutoevaluacion: string | number
): Promise<Segmento[]> {
    const response = await fetch(`/api/autoevaluaciones/${idAutoevaluacion}/segmentos`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(data?.message || `Error ${response.status}: ${response.statusText}`)
    }

    return data as Segmento[]
}

/**
 * Selecciona un segmento para una autoevaluación
 * @param idAutoevaluacion - ID de la autoevaluación
 * @param idSegmento - ID del segmento seleccionado
 */
export async function seleccionarSegmento(
    idAutoevaluacion: string | number,
    idSegmento: number
): Promise<void> {
    const response = await fetch(`/api/autoevaluaciones/${idAutoevaluacion}/segmento`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ id_segmento: idSegmento }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(data?.message || `Error ${response.status}: ${response.statusText}`)
    }
}

/**
 * Guarda las respuestas de la autoevaluación
 * @param idAutoevaluacion - ID de la autoevaluación
 * @param respuestas - Array de respuestas con id_indicador e id_nivel_respuesta
 */
export async function guardarRespuestas(
    idAutoevaluacion: string | number,
    respuestas: RespuestaIndicador[]
): Promise<void> {
    const response = await fetch(`/api/autoevaluaciones/${idAutoevaluacion}/respuestas`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ respuestas }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(data?.message || `Error ${response.status}: ${response.statusText}`)
    }
}

/**
 * Guarda una sola respuesta de la autoevaluación
 * @param idAutoevaluacion - ID de la autoevaluación
 * @param idIndicador - ID del indicador
 * @param idNivelRespuesta - ID del nivel de respuesta seleccionado
 */
export async function guardarRespuesta(
    idAutoevaluacion: string | number,
    idIndicador: number,
    idNivelRespuesta: number
): Promise<void> {
    const response = await fetch(`/api/autoevaluaciones/${idAutoevaluacion}/respuestas`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
            respuestas: [{
                id_indicador: idIndicador,
                id_nivel_respuesta: idNivelRespuesta
            }]
        }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(data?.message || `Error ${response.status}: ${response.statusText}`)
    }
}

/**
 * Valida y finaliza la autoevaluación
 * @param idAutoevaluacion - ID de la autoevaluación
 */
export async function completarAutoevaluacion(
    idAutoevaluacion: string | number
): Promise<void> {
    const response = await fetch(`/api/autoevaluaciones/${idAutoevaluacion}/completar`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(data?.message || `Error ${response.status}: ${response.statusText}`)
    }
}

/**
 * Cancela una autoevaluación pendiente
 * @param idAutoevaluacion - ID de la autoevaluación a cancelar
 */
export async function cancelarAutoevaluacion(
    idAutoevaluacion: string | number
): Promise<void> {
    const response = await fetch(`/api/autoevaluaciones/${idAutoevaluacion}/cancelar`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(data?.message || `Error ${response.status}: ${response.statusText}`)
    }
}

/**
 * Obtiene el historial de autoevaluaciones de una bodega
 * @param idBodega - ID de la bodega
 */
export async function obtenerHistorialAutoevaluaciones(
    idBodega: number
): Promise<AutoevaluacionHistorial[]> {
    const response = await fetch(`/api/autoevaluaciones/historial?id_bodega=${idBodega}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(data?.message || `Error ${response.status}: ${response.statusText}`)
    }

    return data as AutoevaluacionHistorial[]
}

/**
 * Obtiene los resultados detallados de una autoevaluación
 * @param idAutoevaluacion - ID de la autoevaluación
 */
export async function obtenerResultadosAutoevaluacion(
    idAutoevaluacion: string | number
): Promise<ResultadoDetallado> {
    const response = await fetch(`/api/autoevaluaciones/${idAutoevaluacion}/resultados`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(data?.message || `Error ${response.status}: ${response.statusText}`)
    }

    return data as ResultadoDetallado
}

/**
 * Obtiene los resultados de autoevaluación de una bodega
 * @param idBodega - ID de la bodega
 * @returns Resultados de autoevaluación o null si no hay evaluación completada
 */
export async function obtenerResultadosBodega(
    idBodega: number
): Promise<ResultadosAutoevaluacionResponse | null> {
    const response = await fetch(`/api/bodegas/${idBodega}/resultados-autoevaluacion`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
    })

    const data = await response.json().catch(() => ({}))

    // Si el backend devuelve error de recurso no encontrado
    if (!response.ok || data?.error) {
        return null
    }

    return data as ResultadosAutoevaluacionResponse
}

