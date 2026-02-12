"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, FileText, TrendingUp, AlertCircle } from "lucide-react"
import { getAdminStats, type AdminStats } from "@/lib/api/admin"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getAdminStats()
        setStats(data)
      } catch (err) {
        console.error('Error al cargar estadísticas:', err)
        setError(err instanceof Error ? err.message : 'Error al cargar estadísticas')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground">
          Vista general del sistema COVIAR
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Bodegas */}
        <Card className="bg-[#81242d]/20 border-[#81242d]/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#81242d]/70" />
              <CardTitle className="text-sm font-bold text-[#81242d]">Total Bodegas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <Skeleton className="h-8 w-20 bg-[#81242d]/20" />
            ) : (
              <div className="text-2xl font-bold text-[#81242d]">{stats?.totalBodegas ?? 0}</div>
            )}
          </CardContent>
        </Card>

        {/* Evaluaciones Completadas */}
        <Card className="bg-[#81242d]/20 border-[#81242d]/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#81242d]/70" />
              <CardTitle className="text-sm font-bold text-[#81242d]">Evaluaciones Completadas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <Skeleton className="h-8 w-20 bg-[#81242d]/20" />
            ) : (
              <div className="text-2xl font-bold text-[#81242d]">{stats?.evaluacionesCompletadas ?? 0}</div>
            )}
          </CardContent>
        </Card>

        {/* Promedio Sostenibilidad */}
        <Card className="bg-[#81242d]/20 border-[#81242d]/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#81242d]/70" />
              <CardTitle className="text-sm font-bold text-[#81242d]">Promedio Sostenibilidad</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <Skeleton className="h-8 w-20 bg-[#81242d]/20" />
            ) : (
              <div className="text-2xl font-bold text-[#81242d]">
                {stats?.promedioSostenibilidad ? `${stats.promedioSostenibilidad}%` : '0%'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
