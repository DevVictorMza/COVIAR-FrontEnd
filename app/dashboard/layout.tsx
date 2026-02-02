"use client"

import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Cerrar sidebar al cambiar de ruta en mobile
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  useEffect(() => {
    // Verificar si hay usuario en localStorage
    const usuarioStr = localStorage.getItem('usuario')

    if (!usuarioStr) {
      // No hay usuario, redirigir a login
      console.log('No hay usuario en localStorage, redirigiendo a login')
      router.push("/login")
      return
    }

    try {
      const usuario = JSON.parse(usuarioStr)
      console.log('Usuario encontrado en localStorage:', usuario)
      console.log('Estructura del usuario:', JSON.stringify(usuario, null, 2))

      // Verificar que el objeto tiene las propiedades necesarias
      // Soportar multiples formatos de respuesta del backend
      const hasValidStructure = usuario && (
        usuario.cuenta?.email ||           // Formato: { cuenta: { email }, bodega, responsable }
        usuario.email_login ||             // Formato: { id_cuenta, email_login, bodega }
        usuario.email ||                    // Formato directo: { email, ... }
        usuario.id_cuenta ||               // Formato con id_cuenta
        usuario.id ||                       // Formato con id
        usuario.idUsuario                   // Formato Usuario original
      )

      if (!hasValidStructure) {
        console.log('Usuario inválido (sin estructura válida), limpiando localStorage')
        console.log('Propiedades del usuario:', Object.keys(usuario))
        localStorage.removeItem('usuario')
        router.push("/login")
        return
      }

      console.log('Usuario válido, permitiendo acceso al dashboard')
      setIsLoading(false)
    } catch (error) {
      // Error al parsear, limpiar y redirigir
      console.error('Error al parsear usuario de localStorage:', error)
      localStorage.removeItem('usuario')
      router.push("/login")
    }
  }, [router])

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

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex h-full shrink-0">
        <DashboardSidebar />
      </div>

      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop con blur */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsSidebarOpen(false)}
          />
          
          {/* Sidebar Container */}
          <div className="relative flex h-full w-64 max-w-[80vw] flex-col bg-sidebar shadow-xl animate-in slide-in-from-left duration-300">
             <div className="absolute top-2 right-2 z-50 md:hidden">
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="text-white/70 hover:text-white hover:bg-white/10">
                  <X className="h-5 w-5" />
                </Button>
             </div>
             <DashboardSidebar />
          </div>
        </div>
      )}

      {/* Main Content Wrapper */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-sidebar text-white shrink-0">
           <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="text-white hover:bg-white/10 -ml-2">
                <Menu className="h-6 w-6" />
             </Button>
             <span className="font-bold text-lg tracking-wide">COVIAR</span>
           </div>
           {/* Logo pequeño en header móvil */}
           <img 
             src="/assets/logos/logoclarovert.png" 
             alt="Coviar" 
             className="h-8 w-auto object-contain opacity-80" 
           />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
