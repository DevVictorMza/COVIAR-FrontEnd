"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Interfaz que coincide con la respuesta del backend
interface UsuarioData {
  cuenta: {
    id: number
    email: string
    tipo_cuenta: string
  }
  bodega: {
    id: number
    razon_social: string
    nombre_fantasia: string
    cuit: string
    calle: string
    numeracion: string
    telefono: string
    email_institucional: string
    localidad: {
      id: number
      nombre: string
      departamento: string
      provincia: string
    }
  }
  responsable: {
    id: number
    nombre: string
    apellido: string
    cargo: string
    dni: string
    activo: boolean
  }
}

export default function DashboardPage() {
  const [usuario, setUsuario] = useState<UsuarioData | null>(null)

  useEffect(() => {
    const usuarioStr = localStorage.getItem('usuario')
    if (usuarioStr) {
      try {
        const user = JSON.parse(usuarioStr)
        setUsuario(user)
      } catch (error) {
        console.error('Error al parsear usuario:', error)
      }
    }
  }, [])

  if (!usuario) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Bienvenido, {usuario.responsable?.nombre} {usuario.responsable?.apellido}
        </h1>
        <p className="text-muted-foreground">
          {usuario.bodega?.nombre_fantasia} — Panel de control de sostenibilidad enoturística COVIAR
        </p>
      </div>


      {/* Banner de Acceso Principal */}
      <div className="space-y-12 max-w-5xl mx-auto pb-12">
        {/* Título Principal */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-coviar-borravino tracking-tight uppercase">
            Guía de Autoevaluación
            <span className="block text-foreground mt-2 font-sans font-black">Sostenibilidad Enoturística Argentina</span>
          </h2>
          <p className="text-muted-foreground font-medium tracking-widest uppercase">
            #PEVI2030 El Plan de la Vitivinicultura Argentina
          </p>
        </div>

        {/* ¿Qué es? */}
        <div className="bg-muted/30 p-8 rounded-2xl border border-border/50 text-center space-y-4">
          <h3 className="text-2xl font-bold text-foreground">
            ¿Qué es la Guía de Evaluación de la Sostenibilidad Enoturística?
          </h3>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Es un instrumento de evaluación y gestión que permite a las bodegas abiertas al turismo
            <span className="font-semibold text-foreground"> medir, ordenar y mejorar</span> su desempeño en sostenibilidad enoturística,
            considerando las dimensiones <span className="font-semibold text-foreground">ambiental, social y económica</span>.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* ¿Para qué sirve? */}
          <Card className="border-l-4 border-l-coviar-borravino shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold">¿Para qué sirve?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-coviar-borravino font-bold">•</span>
                  Diagnosticar su situación actual en materia de sostenibilidad enoturística.
                </li>
                <li className="flex gap-2">
                  <span className="text-coviar-borravino font-bold">•</span>
                  Identificar brechas y oportunidades de mejora en su gestión turística.
                </li>
                <li className="flex gap-2">
                  <span className="text-coviar-borravino font-bold">•</span>
                  Planificar acciones concretas a corto, mediano y largo plazo.
                </li>
                <li className="flex gap-2">
                  <span className="text-coviar-borravino font-bold">•</span>
                  Ordenar sus prácticas según estándares internacionales reconocidos.
                </li>
                <li className="flex gap-2">
                  <span className="text-coviar-borravino font-bold">•</span>
                  Comunicar resultados de manera consistente a turistas, instituciones y otros públicos de interés.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* ¿Qué beneficios aporta? */}
          <Card className="border-l-4 border-l-coviar-borravino shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold">¿Qué beneficios aporta?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-coviar-borravino font-bold">•</span>
                  Mejorar la calidad y eficiencia de la experiencia turística.
                </li>
                <li className="flex gap-2">
                  <span className="text-coviar-borravino font-bold">•</span>
                  Aumentar la satisfacción del visitante, especialmente del turista consciente.
                </li>
                <li className="flex gap-2">
                  <span className="text-coviar-borravino font-bold">•</span>
                  Reducir riesgos operativos, ambientales y reputacionales.
                </li>
                <li className="flex gap-2">
                  <span className="text-[#880D1E] font-bold">•</span>
                  Fortalecer la integración con la comunidad local.
                </li>
                <li className="flex gap-2">
                  <span className="text-[#880D1E] font-bold">•</span>
                  Contribuir a la preservación del patrimonio cultural y productivo.
                </li>
                <li className="flex gap-2">
                  <span className="text-[#880D1E] font-bold">•</span>
                  Adaptar la gestión sostenible al tamaño y capacidad real de la bodega.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Botón Final */}
        <div className="flex justify-center pt-8">
          <Button
            asChild
            size="lg"
            className="bg-[#880D1E] hover:bg-[#6a0a17] text-white text-xl px-12 py-8 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <Link href="/dashboard/autoevaluacion">
              COMENZAR GUÍA DE AUTOEVALUACIÓN
            </Link>
          </Button>
        </div>
      </div>
    </div >
  )
}
