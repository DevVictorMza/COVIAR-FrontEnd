// /lib/api/admin.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export interface SegmentoDistribucion {
  id_segmento: number
  nombre_segmento: string
  alto: number
  medio: number
  minimo: number
}

export interface AdminStats {
  totalBodegas: number
  evaluacionesCompletadas: number
  promedioSostenibilidad: number
  nivelPromedio: "Nivel mínimo de sostenibilidad" | "Nivel medio de sostenibilidad" | "Nivel alto de sostenibilidad"
  distribucionNiveles: {
    minimo: number
    medio: number
    alto: number
  }
  distribucionPorSegmento: SegmentoDistribucion[]
}

export interface EvaluacionListItem {
  id_autoevaluacion: number
  id_bodega: number
  nombre_bodega: string
  razon_social: string
  estado: 'PENDIENTE' | 'COMPLETADA' | 'CANCELADA'
  fecha_inicio: string
  fecha_fin: string | null
  responsable: string
}

// Interfaces gestión autoevaluación
export interface Nivel {
  id_nivel: number
  numero_nivel: number
  descripcion: string
  puntaje: number
}

export interface Indicador {
  id_indicador: number
  numero_indicador: string
  nombre: string
  descripcion: string
  niveles: Nivel[]
}

export interface Capitulo {
  id_capitulo: number
  numero_capitulo: number
  nombre: string
  descripcion: string
  indicadores: Indicador[]
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


// GESTIÓN DE AUTOEVALUACIÓN

// Obtener todos los capítulos con sus indicadores y niveles
export async function getCapitulos(): Promise<Capitulo[]> {
  const response = await fetch(`${API_BASE_URL}/api/admin/capitulos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.message || `Error ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

// Actualizar capítulo
export async function updateCapitulo(id: number, data: { nombre?: string; descripcion?: string }) {
  const response = await fetch(`${API_BASE_URL}/api/admin/capitulos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Error ${response.status}`)
  }

  return response.json()
}

// Actualizar indicador
export async function updateIndicador(id: number, data: { nombre?: string; descripcion?: string }) {
  const response = await fetch(`${API_BASE_URL}/api/admin/indicadores/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Error ${response.status}`)
  }

  return response.json()
}

// Actualizar nivel
export async function updateNivel(id: number, data: { descripcion?: string; puntaje?: number }) {
  const response = await fetch(`${API_BASE_URL}/api/admin/niveles/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Error ${response.status}`)
  }

  return response.json()
}