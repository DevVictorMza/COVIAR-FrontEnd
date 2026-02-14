"use client"

import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  useEffect(() => {
    const usuarioStr = localStorage.getItem('usuario')
    const tipoCuenta = localStorage.getItem('tipoCuenta')

    if (!usuarioStr || tipoCuenta !== 'ADMINISTRADOR_APP') {
      // Si no es admin, redirigir a login
      router.push("/login")
      return
    }

    setIsLoading(false)
  }, [router])

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
        <AdminSidebar />
      </div>

      {/* Sidebar Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="relative flex h-full w-64 max-w-[80vw] flex-col bg-sidebar shadow-xl animate-in slide-in-from-left duration-300">
             <div className="absolute top-2 right-2 z-50 md:hidden">
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="text-white/70 hover:text-white hover:bg-white/10">
                  <X className="h-5 w-5" />
                </Button>
             </div>
             <AdminSidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-sidebar text-white shrink-0">
           <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="text-white hover:bg-white/10 -ml-2">
                <Menu className="h-6 w-6" />
             </Button>
             <span className="font-bold text-lg tracking-wide">ADMIN</span>
           </div>
           <img
             src="/assets/logos/logoclarovert.png"
             alt="Coviar"
             className="h-8 w-auto object-contain opacity-80"
           />
        </div>

        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
