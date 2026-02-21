"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Search, Building2, Filter, ChevronLeft, ChevronRight, Loader2, KeyRound } from "lucide-react"

interface Bodega {
  id_bodega: number
  razon_social: string
  nombre_fantasia: string
  cuit: string
  inv_bod: string | null
  inv_vin: string | null
  calle: string
  numeracion: string
  telefono: string
  email_institucional: string
  fecha_registro: string
}

export default function GestionBodegasPage() {
  const [bodegas, setBodegas] = useState<Bodega[]>([])
  const [filteredBodegas, setFilteredBodegas] = useState<Bodega[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [changingPasswordId, setChangingPasswordId] = useState<number | null>(null)

  useEffect(() => {
    fetchBodegas()
  }, [])

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredBodegas(bodegas)
    } else {
      const filtered = bodegas.filter(bodega =>
        bodega.nombre_fantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bodega.razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bodega.cuit.includes(searchTerm) ||
        bodega.email_institucional.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredBodegas(filtered)
    }
    setCurrentPage(1)
  }, [searchTerm, bodegas])

  const fetchBodegas = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/bodegas", { credentials: "include" })
      if (!response.ok) throw new Error("Error al cargar bodegas")
      const data: Bodega[] = await response.json()
      setBodegas(data)
      setFilteredBodegas(data)
      setCurrentPage(1)
    } catch (err) {
      console.error("Error al cargar bodegas:", err)
      setError(err instanceof Error ? err.message : "Error al cargar bodegas")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const handleCambiarContrasena = async (bodega: Bodega) => {
    try {
      setChangingPasswordId(bodega.id_bodega)
      const response = await fetch(`/api/bodegas/${bodega.id_bodega}/reset-password`, {
        method: "POST",
        credentials: "include",
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al enviar el correo de cambio de contraseña")
      }
    } catch (err) {
      console.error("Error al cambiar contraseña:", err)
      setError(err instanceof Error ? err.message : "Error al cambiar contraseña")
    } finally {
      setChangingPasswordId(null)
    }
  }

  const totalPages = Math.ceil(filteredBodegas.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBodegas = filteredBodegas.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Bodegas</h1>
          <p className="text-muted-foreground">
            Administra y supervisa todas las bodegas registradas en el sistema
          </p>
        </div>
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
          <CardDescription>Busca bodegas por nombre, razón social, CUIT o email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por bodega, razón social, CUIT o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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
            <Building2 className="h-4 w-4" />
            <span>
              Mostrando {filteredBodegas.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredBodegas.length)} de {filteredBodegas.length} bodegas
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Bodegas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredBodegas.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No se encontraron bodegas</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Razón Social</TableHead>
                      <TableHead>Nombre Fantasía</TableHead>
                      <TableHead>CUIT</TableHead>
                      <TableHead>INV Bodega</TableHead>
                      <TableHead>INV Viñedo</TableHead>
                      <TableHead>Dirección</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Email Institucional</TableHead>
                      <TableHead>Fecha Registro</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentBodegas.map((bodega) => (
                      <TableRow key={bodega.id_bodega}>
                        <TableCell className="font-medium">{bodega.id_bodega}</TableCell>
                        <TableCell>{bodega.razon_social}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{bodega.nombre_fantasia}</TableCell>
                        <TableCell className="text-sm">{bodega.cuit}</TableCell>
                        <TableCell className="text-sm">{bodega.inv_bod || "-"}</TableCell>
                        <TableCell className="text-sm">{bodega.inv_vin || "-"}</TableCell>
                        <TableCell className="text-sm">
                          {bodega.calle ? `${bodega.calle} ${bodega.numeracion}` : "-"}
                        </TableCell>
                        <TableCell className="text-sm">{bodega.telefono || "-"}</TableCell>
                        <TableCell className="text-sm">{bodega.email_institucional}</TableCell>
                        <TableCell className="text-sm">{formatDate(bodega.fecha_registro)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCambiarContrasena(bodega)}
                            disabled={changingPasswordId === bodega.id_bodega}
                          >
                            {changingPasswordId === bodega.id_bodega ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <KeyRound className="h-4 w-4 mr-2" />
                            )}
                            {changingPasswordId === bodega.id_bodega ? "Enviando..." : "Cambiar contraseña"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación */}
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