// /lib/api/admin.ts

export interface AdminStats {
  totalBodegas: number
  evaluacionesCompletadas: number
  promedioSostenibilidad: number
}

export interface EvaluacionListItem {
  id_autoevaluacion: number
  id_bodega: number
  nombre_bodega: string
  razon_social: string
  estado: 'PENDIENTE' | 'COMPLETADA' | 'CANCELADA'
  porcentaje: number | null
  fecha_inicio: string
  fecha_fin: string | null
  responsable: string
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const response = await fetch('/api/admin/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    throw error
  }
}

export async function getEvaluaciones(estado?: string, idBodega?: number): Promise<EvaluacionListItem[]> {
  try {
    const params = new URLSearchParams()
    if (estado && estado !== 'TODOS') params.append('estado', estado)
    if (idBodega) params.append('id_bodega', idBodega.toString())

    const url = `/api/admin/evaluaciones${params.toString() ? `?${params.toString()}` : ''}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al obtener evaluaciones:', error)
    throw error
  }
}
