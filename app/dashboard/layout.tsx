"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useAuth } from "@/lib/hooks"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('Usuario no autenticado, redirigiendo a /login')
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  // Mostrar loading mientras verifica
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado, no renderizar nada (ya está redirigiendo)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto bg-background">{children}</main>
    </div>
  )
}
