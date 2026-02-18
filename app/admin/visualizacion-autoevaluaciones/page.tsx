"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getEvaluaciones, type EvaluacionListItem } from "@/lib/api/admin"
import { AlertCircle, Search, FileText, Filter, Eye, Download, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function GestionAutoevaluacionPage() {
  const [evaluaciones, setEvaluaciones] = useState<EvaluacionListItem[]>([])
  const [filteredEvaluaciones, setFilteredEvaluaciones] = useState<EvaluacionListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filtros
  const [estadoFilter, setEstadoFilter] = useState<string>("TODOS")
  const [searchTerm, setSearchTerm] = useState("")

  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)

  useEffect(() => {
    fetchEvaluaciones()
  }, [estadoFilter])

  useEffect(() => {
    // Aplicar búsqueda y resetear a página 1
    if (searchTerm === "") {
      setFilteredEvaluaciones(evaluaciones)
    } else {
      const filtered = evaluaciones.filter(evaluacion =>
        evaluacion.nombre_bodega.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluacion.razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluacion.responsable.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredEvaluaciones(filtered)
    }
    setCurrentPage(1) // Resetear a página 1 cuando cambian los filtros
  }, [searchTerm, evaluaciones])

  const fetchEvaluaciones = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getEvaluaciones(estadoFilter === "TODOS" ? undefined : estadoFilter)
      setEvaluaciones(data)
      setFilteredEvaluaciones(data)
      setCurrentPage(1) // Resetear a página 1 cuando cambia el estado
    } catch (err) {
      console.error('Error al cargar evaluaciones:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar evaluaciones')
    } finally {
      setIsLoading(false)
    }
  }

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      'PENDIENTE': { variant: "secondary", label: "Pendiente" },
      'COMPLETADA': { variant: "default", label: "Completada" },
      'CANCELADA': { variant: "destructive", label: "Cancelada" }
    }
    const config = variants[estado] || { variant: "outline" as const, label: estado }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const exportToCSV = () => {
    if (filteredEvaluaciones.length === 0) return

    const headers = ["ID", "Bodega", "Razón Social", "Estado", "Porcentaje", "Fecha Inicio", "Fecha Fin", "Responsable"]
    const rows = filteredEvaluaciones.map(evaluacion => [
      evaluacion.id_autoevaluacion,
      evaluacion.nombre_bodega,
      evaluacion.razon_social,
      evaluacion.estado,
      evaluacion.porcentaje ? `${evaluacion.porcentaje}%` : "N/A",
      formatDate(evaluacion.fecha_inicio),
      formatDate(evaluacion.fecha_fin),
      evaluacion.responsable
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `evaluaciones_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  // Calcular paginación
  const totalPages = Math.ceil(filteredEvaluaciones.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentEvaluaciones = filteredEvaluaciones.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top de la tabla
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1) // Resetear a página 1 cuando cambia el límite
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Autoevaluaciones</h1>
          <p className="text-muted-foreground">
            Administra y supervisa todas las autoevaluaciones del sistema
          </p>
        </div>
        <Button onClick={exportToCSV} disabled={filteredEvaluaciones.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Filtros</CardTitle>
          </div>
          <CardDescription>Filtra las evaluaciones por estado o busca por nombre</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por bodega, razón social o responsable..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <label className="text-sm font-medium mb-2 block">Estado</label>
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos</SelectItem>
                  <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                  <SelectItem value="COMPLETADA">Completada</SelectItem>
                  <SelectItem value="CANCELADA">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <label className="text-sm font-medium mb-2 block">Mostrar</label>
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 registros</SelectItem>
                  <SelectItem value="50">50 registros</SelectItem>
                  <SelectItem value="100">100 registros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>
              Mostrando {startIndex + 1}-{Math.min(endIndex, filteredEvaluaciones.length)} de {filteredEvaluaciones.length} evaluaciones
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de evaluaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Evaluaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredEvaluaciones.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No se encontraron evaluaciones</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Bodega</TableHead>
                      <TableHead>Razón Social</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Porcentaje</TableHead>
                      <TableHead>Fecha Inicio</TableHead>
                      <TableHead>Fecha Fin</TableHead>
                      <TableHead>Responsable</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentEvaluaciones.map((evaluacion) => (
                      <TableRow key={evaluacion.id_autoevaluacion}>
                        <TableCell className="font-medium">{evaluacion.id_autoevaluacion}</TableCell>
                        <TableCell>{evaluacion.nombre_bodega}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{evaluacion.razon_social}</TableCell>
                        <TableCell>{getEstadoBadge(evaluacion.estado)}</TableCell>
                        <TableCell>
                          {evaluacion.porcentaje !== null ? (
                            <span className="font-semibold text-[#81242d]">{evaluacion.porcentaje.toFixed(1)}%</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{formatDate(evaluacion.fecha_inicio)}</TableCell>
                        <TableCell className="text-sm">{formatDate(evaluacion.fecha_fin)}</TableCell>
                        <TableCell className="text-sm">{evaluacion.responsable}</TableCell>
                        <TableCell className="text-right">
                          {evaluacion.estado === 'COMPLETADA' && (
                            <Link href={`/dashboard/resultados/${evaluacion.id_autoevaluacion}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Resultados
                              </Button>
                            </Link>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Controles de Paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Anterior
                    </Button>

                    {/* Números de página */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber: number
                        if (totalPages <= 5) {
                          pageNumber = i + 1
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i
                        } else {
                          pageNumber = currentPage - 2 + i
                        }

                        return (
                          <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNumber)}
                            className="w-9 h-9 p-0"
                          >
                            {pageNumber}
                          </Button>
                        )
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
