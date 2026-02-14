"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileSpreadsheet, FileText, Plus, ClipboardList } from "lucide-react"
import { obtenerHistorialAutoevaluaciones, obtenerResultadosAutoevaluacion } from "@/lib/api/autoevaluacion"
import type { AutoevaluacionHistorial, ResultadoDetallado } from "@/lib/api/types"
import { EvaluationCard } from "@/components/historial/evaluation-card"
import { exportHistorialToCSV, exportHistorialToPDF } from "@/lib/utils/export-utils"
import { NivelesSostenibilidadTable } from "@/components/results/niveles-sostenibilidad-table"

export default function HistorialPage() {
  const [assessments, setAssessments] = useState<AutoevaluacionHistorial[]>([])
  const [resultadosCache, setResultadosCache] = useState<Record<number, ResultadoDetallado>>({})
  const [loadingDetails, setLoadingDetails] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getBodegaId = () => {
    const usuarioStr = localStorage.getItem('usuario')
    if (!usuarioStr) return null
    const usuario = JSON.parse(usuarioStr)
    return usuario.bodega?.id_bodega || usuario.id_bodega
  }

  const guardarResultadosEnCache = (resultados: Record<number, ResultadoDetallado>) => {
    const idBodega = getBodegaId()
    if (idBodega) {
      try {
        localStorage.setItem(`resultados_${idBodega}`, JSON.stringify(resultados))
      } catch { /* localStorage lleno */ }
    }
  }

  useEffect(() => {
    async function cargarHistorial() {
      try {
        const usuarioStr = localStorage.getItem('usuario')

        if (!usuarioStr) {
          setError('No hay usuario autenticado')
          setIsLoading(false)
          return
        }

        const usuario = JSON.parse(usuarioStr)
        const idBodega = usuario.bodega?.id_bodega || usuario.id_bodega

        if (!idBodega) {
          setIsLoading(false)
          return
        }

        const CACHE_KEY = `historial_${idBodega}`
        const RESULTADOS_CACHE_KEY = `resultados_${idBodega}`

        // 1. Mostrar cache inmediatamente si existe (carga instantánea)
        const cachedStr = localStorage.getItem(CACHE_KEY)
        if (cachedStr) {
          try {
            const cached = JSON.parse(cachedStr) as AutoevaluacionHistorial[]
            if (Array.isArray(cached) && cached.length > 0) {
              setAssessments(cached)
              setIsLoading(false)
            }
          } catch {
            localStorage.removeItem(CACHE_KEY)
          }
        }

        // Cargar resultados cacheados (los que ya se descargaron antes)
        const cachedResultadosStr = localStorage.getItem(RESULTADOS_CACHE_KEY)
        if (cachedResultadosStr) {
          try {
            const resultadosMap = JSON.parse(cachedResultadosStr)
            setResultadosCache(resultadosMap)
          } catch {
            localStorage.removeItem(RESULTADOS_CACHE_KEY)
          }
        }

        // 2. SIEMPRE consultar la BD para obtener datos frescos del historial
        const data = await obtenerHistorialAutoevaluaciones(idBodega)
        const completadas = data
          .filter(a => a.estado === 'completada')
          .sort((a, b) => new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime())

        setAssessments(completadas)
        setIsLoading(false)

        // Actualizar cache del historial
        if (completadas.length > 0) {
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(completadas))
          } catch { /* localStorage lleno */ }
        } else {
          localStorage.removeItem(CACHE_KEY)
        }
      } catch (err) {
        console.error('Error al cargar historial:', err)
        setError('Error al cargar el historial. Verifica tu conexión.')
      } finally {
        setIsLoading(false)
      }
    }

    cargarHistorial()
  }, [])

  // Carga bajo demanda: retorna el resultado para que el card pueda usarlo
  const handleLoadDetails = useCallback(async (idAutoevaluacion: number): Promise<ResultadoDetallado | null> => {
    const cached = resultadosCache[idAutoevaluacion]
    const hasIndicatorData = cached?.capitulos?.some(c => c.indicadores && c.indicadores.length > 0)
    if (cached && hasIndicatorData) return cached

    setLoadingDetails(idAutoevaluacion)
    try {
      const resultado = await obtenerResultadosAutoevaluacion(idAutoevaluacion)
      setResultadosCache(prev => {
        const updated = { ...prev, [idAutoevaluacion]: resultado }
        guardarResultadosEnCache(updated)
        return updated
      })
      return resultado
    } catch (err) {
      console.error('Error al cargar detalles:', err)
      return null
    } finally {
      setLoadingDetails(null)
    }
  }, [resultadosCache])

  const handleExportAllCSV = () => {
    exportHistorialToCSV(assessments, 'historial_autoevaluaciones')
  }

  const handleExportAllPDF = () => {
    const usuarioStr = localStorage.getItem('usuario')
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : {}
    const bodegaNombre = usuario.bodega?.nombre_fantasia || 'Bodega'
    exportHistorialToPDF(assessments, bodegaNombre, 'historial_autoevaluaciones')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando historial...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-destructive bg-destructive/10 p-4 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  // Estado vacío - sin evaluaciones completadas
  if (assessments.length === 0) {
    return (
      <div className="p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Historial de Autoevaluaciones</h1>
          <p className="text-base text-muted-foreground">
            Registro de todas tus evaluaciones de sostenibilidad enoturística
          </p>
        </div>

        <Card className="text-center py-16">
          <CardContent>
            <ClipboardList className="h-20 w-20 text-[#880D1E]/30 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-3">¡Bienvenido/a!</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Realiza tu primera autoevaluación para comenzar a ver tu historial de sostenibilidad aquí.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#880D1E] hover:bg-[#6a0a17] gap-2"
            >
              <Link href="/dashboard/autoevaluacion">
                <Plus className="h-5 w-5" />
                Realizar Primera Autoevaluación
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Tabla de Niveles de Sostenibilidad - como referencia */}
        <NivelesSostenibilidadTable />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header mejorado */}
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Historial de Autoevaluaciones</h1>
          <p className="text-base text-muted-foreground">
            Registro de todas tus evaluaciones de sostenibilidad enoturística
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleExportAllCSV}
            className="gap-2 bg-[#81242d] text-white hover:bg-[#6a0a17] shadow-sm"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Descargar Todo CSV
          </Button>
          <Button
            onClick={handleExportAllPDF}
            className="gap-2 bg-[#81242d] text-white hover:bg-[#6a0a17] shadow-sm"
          >
            <FileText className="h-4 w-4" />
            Descargar Todo PDF
          </Button>
        </div>
      </div>

      {/* Lista de evaluaciones con más espacio */}
      <div className="space-y-8">
        {assessments.map((assessment, index) => (
          <EvaluationCard
            key={assessment.id_autoevaluacion}
            evaluacion={assessment}
            resultado={resultadosCache[assessment.id_autoevaluacion] || null}
            index={index}
            total={assessments.length}
            isLoading={loadingDetails === assessment.id_autoevaluacion}
            onLoadDetails={handleLoadDetails}
          />
        ))}
      </div>
    </div>
  )
}
