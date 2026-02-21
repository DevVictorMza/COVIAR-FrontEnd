"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, FileCheck, AlertCircle } from "lucide-react"
import { getAdminStats, type AdminStats, type SegmentoDistribucion } from "@/lib/api/admin"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts"

// ─── Colores por nivel ─────────────────────────────────────────────────────────

const COLORS = {
  minimo: "#f59e0b",
  medio:  "#10b981",
  alto:   "#059669",
  vacio:  "#e5e7eb",
}

const NIVEL_COLOR: Record<string, string> = {
  "Nivel mínimo de sostenibilidad": COLORS.minimo,
  "Nivel medio de sostenibilidad":  COLORS.medio,
  "Nivel alto de sostenibilidad":   COLORS.alto,
}

// SegmentoDistribucion is imported from admin.ts

// ─── Tooltip personalizado para el BarChart ────────────────────────────────────

function BarTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (active && payload?.length) {
    const { value, payload: data } = payload[0]
    return (
      <div className="bg-gray-900 text-white rounded-lg shadow-xl px-3 py-2 text-xs">
        <p className="font-semibold">{data.name}</p>
        <p>{value} {value === 1 ? "bodega" : "bodegas"}</p>
      </div>
    )
  }
  return null
}

// ─── Tooltip personalizado para el PieChart general ───────────────────────────

function CustomTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (active && payload?.length && payload[0].name !== "Resto") {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs">
        <p className="font-semibold text-gray-700">{payload[0].name}</p>
        <p className="text-gray-500">{payload[0].value} bodegas</p>
      </div>
    )
  }
  return null
}

// ─── Dashboard principal ───────────────────────────────────────────────────────

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
        console.error("Error al cargar estadísticas:", err)
        setError(err instanceof Error ? err.message : "Error al cargar estadísticas")
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  const dist = stats?.distribucionNiveles ?? { minimo: 0, medio: 0, alto: 0 }
  const totalConNivel = dist.minimo + dist.medio + dist.alto

  const dataGeneral = [
    { name: "Nivel mínimo de sostenibilidad", value: dist.minimo, color: COLORS.minimo },
    { name: "Nivel medio de sostenibilidad",  value: dist.medio,  color: COLORS.medio  },
    { name: "Nivel alto de sostenibilidad",   value: dist.alto,   color: COLORS.alto   },
  ]

  const sinDatos = [{ name: "Sin datos", value: 1, color: COLORS.vacio }]
  const nivelColor = NIVEL_COLOR[stats?.nivelPromedio ?? ""] ?? "#374151"

  const distribucionPorSegmento: SegmentoDistribucion[] = stats?.distribucionPorSegmento ?? []

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground">Vista general del sistema COVIAR</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* ── Fila superior: tarjetas + gráfico general ── */}
      <div className="grid md:grid-cols-3 gap-6 items-stretch">

        {/* Columna izquierda: tarjetas apiladas */}
        <div className="flex flex-col gap-6">
          <Card className="bg-white border-l-4 border-l-coviar-borravino flex-1">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-coviar-borravino" />
                <CardTitle className="text-sm font-bold text-gray-700">Total Bodegas</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold text-coviar-borravino">
                  {stats?.totalBodegas || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-[#B89B5E] flex-1">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-[#B89B5E]" />
                <CardTitle className="text-sm font-bold text-gray-700">Evaluaciones Realizadas</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold text-[#B89B5E]">
                  {stats?.evaluacionesCompletadas || 0}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha: gráfico promedio general (ocupa 2 columnas) */}
        <Card className="md:col-span-2 bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-bold text-gray-700 text-center">
              Promedio general de nivel de sostenibilidad
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-2 pb-4">
            {isLoading ? (
              <Skeleton className="h-56 w-56 rounded-full mx-auto" />
            ) : (
              <>
                <div className="relative w-full" style={{ height: 240 }}>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={totalConNivel === 0 ? sinDatos : dataGeneral}
                        cx="50%"
                        cy="50%"
                        innerRadius={72}
                        outerRadius={105}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        animationBegin={0}
                        animationDuration={900}
                        animationEasing="ease-out"
                        stroke="none"
                      >
                        {(totalConNivel === 0 ? sinDatos : dataGeneral).map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center px-8" style={{ maxWidth: 150 }}>
                      <p className="text-xs font-bold leading-snug" style={{ color: nivelColor }}>
                        {stats?.nivelPromedio ?? "Sin datos"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  {dataGeneral.map((d) => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-xs text-gray-600">
                        {d.name.replace("Nivel ", "").replace(" de sostenibilidad", "")}: {d.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="mt-4"><h1 className="text-3xl font-bold">Niveles de sostenibilidad por segmentación</h1></div>

      {/* ── Fila inferior: gráficos de barras por segmento ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-52 w-full rounded-xl" />)}
        </div>
      ) : distribucionPorSegmento.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No hay datos de segmentación disponibles</p>
      ) : (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${Math.min(distribucionPorSegmento.length, 5)}, minmax(0, 1fr))` }}
        >
          {distribucionPorSegmento.map((seg) => {
            const barData = [
              { nivel: "Alto",  name: "Nivel alto de sostenibilidad",  value: seg.alto,   fill: COLORS.alto   },
              { nivel: "Medio", name: "Nivel medio de sostenibilidad", value: seg.medio,  fill: COLORS.medio  },
              { nivel: "Bajo",  name: "Nivel mínimo de sostenibilidad",value: seg.minimo, fill: COLORS.minimo },
            ]
            const total = seg.alto + seg.medio + seg.minimo
            return (
              <Card key={seg.id_segmento} className="bg-white border border-gray-200 shadow-sm flex flex-col">
                <CardHeader className="pb-1 px-4 pt-4">
                  <CardTitle className="text-xs font-bold text-gray-700 text-center leading-tight">
                    {seg.nombre_segmento}
                  </CardTitle>
                  <p className="text-xs text-center text-muted-foreground mt-0.5">
                    {total} {total === 1 ? "bodega" : "bodegas"}
                  </p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center pt-2 pb-4 px-2">
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart
                      data={barData}
                      margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
                      barCategoryGap="30%"
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis
                        dataKey="nivel"
                        tick={{ fontSize: 10, fill: "#6b7280" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 10, fill: "#9ca3af" }}
                        axisLine={false}
                        tickLine={false}
                        width={28}
                      />
                      <Tooltip
                        content={<BarTooltip />}
                        cursor={{ fill: "rgba(0,0,0,0.04)" }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={700}>
                        {barData.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} name={entry.name} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}