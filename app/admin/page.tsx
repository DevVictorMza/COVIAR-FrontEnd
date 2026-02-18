"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, FileCheck, AlertCircle } from "lucide-react"
import { getAdminStats, type AdminStats } from "@/lib/api/admin"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

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

// ─── Tooltip personalizado ─────────────────────────────────────────────────────

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

  const smallCharts = [
    {
      title: "Bodegas con nivel mínimo de sostenibilidad",
      value: dist.minimo,
      color: COLORS.minimo,
      data: [
        { name: "Nivel mínimo de sostenibilidad", value: dist.minimo,                 color: COLORS.minimo },
        { name: "Resto",                           value: totalConNivel - dist.minimo, color: COLORS.vacio  },
      ],
    },
    {
      title: "Bodegas con nivel medio de sostenibilidad",
      value: dist.medio,
      color: COLORS.medio,
      data: [
        { name: "Nivel medio de sostenibilidad",  value: dist.medio,                  color: COLORS.medio  },
        { name: "Resto",                           value: totalConNivel - dist.medio,  color: COLORS.vacio  },
      ],
    },
    {
      title: "Bodegas con nivel alto de sostenibilidad",
      value: dist.alto,
      color: COLORS.alto,
      data: [
        { name: "Nivel alto de sostenibilidad",   value: dist.alto,                   color: COLORS.alto   },
        { name: "Resto",                           value: totalConNivel - dist.alto,   color: COLORS.vacio  },
      ],
    },
  ]

  const nivelColor = NIVEL_COLOR[stats?.nivelPromedio ?? ""] ?? "#374151"
  const sinDatos = [{ name: "Sin datos", value: 1, color: COLORS.vacio }]

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
                {/* Contenedor relativo para superponer el label central */}
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
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Label central superpuesto con div absoluto */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center px-8" style={{ maxWidth: 150 }}>
                      <p className="text-xs font-bold leading-snug" style={{ color: nivelColor }}>
                        {stats?.nivelPromedio ?? "Sin datos"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Leyenda */}
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

      {/* ── Fila inferior: 3 gráficos por nivel ── */}
      <div className="grid md:grid-cols-3 gap-6">
        {smallCharts.map((chart) => (
          <Card key={chart.title} className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-bold text-gray-700 text-center leading-tight">
                {chart.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-2 pb-4">
              {isLoading ? (
                <Skeleton className="h-36 w-36 rounded-full" />
              ) : (
                <>
                  <div className="relative" style={{ width: 160, height: 160 }}>
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie
                          data={totalConNivel === 0 ? sinDatos : chart.data}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={72}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                          animationBegin={200}
                          animationDuration={900}
                          animationEasing="ease-out"
                          stroke="none"
                        >
                          {(totalConNivel === 0 ? sinDatos : chart.data).map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Número central superpuesto */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-bold" style={{ color: chart.color }}>
                        {chart.value}
                      </span>
                      <span className="text-xs text-gray-400">
                        {chart.value === 1 ? "bodega" : "bodegas"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    {totalConNivel > 0
                      ? `${Math.round((chart.value / totalConNivel) * 100)}% del total`
                      : "Sin datos"}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}