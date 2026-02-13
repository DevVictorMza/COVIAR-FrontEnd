// lib/api/autoevaluacion.ts

import type { EstructuraAutoevaluacionResponse, Segmento, CrearAutoevaluacionResponse, RespuestaIndicador, RespuestaGuardada, AutoevaluacionHistorial, ResultadoDetallado, ResultadosAutoevaluacionResponse, EvidenciaResponse, Evidencia } from './types'

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
): Promise<RespuestaGuardada[]> {
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

    // Formato confirmado: { mensaje, respuestas: [{ id_respuesta, id_nivel_respuesta, id_indicador, id_autoevaluacion }] }
    if (data?.respuestas && Array.isArray(data.respuestas)) {
        return data.respuestas as RespuestaGuardada[]
    }
    return []
}

/**
 * Guarda una sola respuesta y retorna la respuesta guardada con id_respuesta
 * Usado como fallback para obtener el id_respuesta cuando no se capturó del POST masivo
 */
export async function guardarRespuestaIndividual(
    idAutoevaluacion: string | number,
    idIndicador: number,
    idNivelRespuesta: number
): Promise<RespuestaGuardada | null> {
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
        console.warn('guardarRespuestaIndividual: Error', response.status, data)
        return null
    }

    // Formato confirmado: { mensaje, respuestas: [{ id_respuesta, ... }] }
    if (data?.respuestas?.[0]?.id_respuesta != null) {
        return data.respuestas[0] as RespuestaGuardada
    }
    return null
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

// ============= EVIDENCIAS =============

/** Tamaño máximo permitido para archivos de evidencia (2 MB) */
export const MAX_EVIDENCE_FILE_SIZE = 2 * 1024 * 1024

/**
 * Sube un archivo PDF de evidencia para una respuesta
 * @param idAutoevaluacion - ID de la autoevaluación
 * @param idRespuesta - ID de la respuesta (devuelto por el backend al guardar)
 * @param archivo - Archivo PDF a subir (máximo 2 MB)
 * @returns Respuesta con la evidencia creada
 * @throws Error si el archivo excede el tamaño máximo o no es PDF
 */
export async function subirEvidencia(
    idAutoevaluacion: string | number,
    idRespuesta: number,
    archivo: File
): Promise<EvidenciaResponse> {
    // Validación de tipo
    if (archivo.type !== 'application/pdf') {
        throw new Error('Solo se permiten archivos en formato PDF')
    }

    // Validación de tamaño (2 MB)
    if (archivo.size > MAX_EVIDENCE_FILE_SIZE) {
        const sizeMB = (archivo.size / (1024 * 1024)).toFixed(2)
        throw new Error(`El archivo excede el tamaño máximo permitido de 2 MB (${sizeMB} MB)`)
    }

    const formData = new FormData()
    formData.append('file', archivo, archivo.name)

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const headers: HeadersInit = {}
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }
    // No setear Content-Type: el navegador lo genera con el boundary correcto

    const url = `/api/autoevaluaciones/${idAutoevaluacion}/respuestas/${idRespuesta}/evidencias`
    console.log(`subirEvidencia: POST ${url} (archivo: ${archivo.name}, ${(archivo.size / 1024).toFixed(1)} KB)`)

    const response = await fetch(url, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: formData,
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        console.error('subirEvidencia: Error', response.status, JSON.stringify(data))
        throw new Error(data?.message || data?.error || `Error ${response.status}: ${response.statusText}`)
    }

    console.log('subirEvidencia: Éxito', JSON.stringify(data))
    return data as EvidenciaResponse
}

/**
 * Obtiene las evidencias de una respuesta específica
 * @param idAutoevaluacion - ID de la autoevaluación
 * @param idRespuesta - ID de la respuesta
 * @returns Evidencia de la respuesta o null si no existe
 */
export async function obtenerEvidencia(
    idAutoevaluacion: string | number,
    idRespuesta: number
): Promise<Evidencia | null> {
    const response = await fetch(
        `/api/autoevaluaciones/${idAutoevaluacion}/respuestas/${idRespuesta}/evidencias`,
        {
            method: 'GET',
            headers: getAuthHeaders(),
            credentials: 'include',
        }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        if (response.status === 404) return null
        throw new Error(data?.message || `Error ${response.status}: ${response.statusText}`)
    }

    // La API puede devolver un objeto con evidencia o un array
    if (data.evidencia) return data.evidencia as Evidencia
    if (Array.isArray(data.evidencias) && data.evidencias.length > 0) return data.evidencias[0] as Evidencia
    return data as Evidencia
}

/**
 * Elimina la evidencia de una respuesta
 * @param idAutoevaluacion - ID de la autoevaluación
 * @param idRespuesta - ID de la respuesta
 */
export async function eliminarEvidencia(
    idAutoevaluacion: string | number,
    idRespuesta: number
): Promise<void> {
    const url = `/api/autoevaluaciones/${idAutoevaluacion}/respuestas/${idRespuesta}/evidencia`
    console.log(`eliminarEvidencia: DELETE ${url}`)
    
    const response = await fetch(url, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        console.error('eliminarEvidencia: Error', response.status, JSON.stringify(data))
        throw new Error(data?.message || `Error ${response.status}: ${response.statusText}`)
    }
    
    console.log('eliminarEvidencia: Éxito')
}

/**
 * Descarga el archivo PDF de evidencia de una respuesta
 * @param idAutoevaluacion - ID de la autoevaluación
 * @param idRespuesta - ID de la respuesta
 * @returns Abre el archivo PDF en una nueva pestaña o inicia descarga según el navegador
 */
export async function descargarEvidencia(
    idAutoevaluacion: string | number,
    idRespuesta: number
): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const headers: HeadersInit = {}
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    const url = `/api/autoevaluaciones/${idAutoevaluacion}/respuestas/${idRespuesta}/evidencia/descargar`
    console.log(`descargarEvidencia: GET ${url}`)

    const response = await fetch(url, {
        method: 'GET',
        headers,
        credentials: 'include',
    })

    if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        console.error('descargarEvidencia: Error', response.status, JSON.stringify(data))
        throw new Error(data?.message || `Error ${response.status}: No se pudo descargar la evidencia`)
    }

    // Obtener el blob del archivo
    const blob = await response.blob()
    
    // Crear URL temporal para el blob
    const blobUrl = window.URL.createObjectURL(blob)
    
    // Obtener nombre del archivo del header Content-Disposition
    const contentDisposition = response.headers.get('Content-Disposition')
    let filename = `evidencia_${idRespuesta}.pdf`
    
    if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '')
        }
    }
    
    // Crear link temporal y hacer click para iniciar descarga
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Limpiar el URL temporal
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100)
    
    console.log('descargarEvidencia: Descarga iniciada', filename)
}

