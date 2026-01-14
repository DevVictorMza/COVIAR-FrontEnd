"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { provinciasArgentina, departamentosData } from "@/lib/assessment/geo-data"
import { actividadesOptions, litrosVinoRango } from "@/lib/assessment/options-data"

import Link from "next/link"


export default function RegistroPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Administrator data
  const [adminFirstName, setAdminFirstName] = useState("")
  const [adminLastName, setAdminLastName] = useState("")
  const [adminRole, setAdminRole] = useState("")
  const [adminPhone, setAdminPhone] = useState("")

  // Winery data
  const [email, setEmail] = useState("")
  const [razonSocial, setRazonSocial] = useState("")
  const [nombreFantasia, setNombreFantasia] = useState("")
  const [cuit, setCuit] = useState("")
  const [bodegaInv, setBodegaInv] = useState("")
  const [vinedoInv, setVinedoInv] = useState("")
  const [provincia, setProvincia] = useState("")
  const [departamento, setDepartamento] = useState("")
  const [codigoPostal, setCodigoPostal] = useState("")
  const [distrito, setDistrito] = useState("")
  const [calleNumeracion, setCalleNumeracion] = useState("")
  const [actividades, setActividades] = useState<string[]>([])
  const [litrosVino, setLitrosVino] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleActivityToggle = (activity: string) => {
    setActividades((prev) => (prev.includes(activity) ? prev.filter((a) => a !== activity) : [...prev, activity]))
  }

  const handleProvinciaChange = (value: string) => {
    setProvincia(value)
    setDepartamento("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            admin_first_name: adminFirstName,
            admin_last_name: adminLastName,
            admin_role: adminRole,
            admin_phone: adminPhone,
            razon_social: razonSocial,
            nombre_fantasia: nombreFantasia,
            cuit,
            bodega_inv: bodegaInv,
            vinedo_inv: vinedoInv,
            provincia,
            departamento,
            codigo_postal: codigoPostal,
            distrito,
            calle_numeracion: calleNumeracion,
            actividades: JSON.stringify(actividades),
            litros_vino_rango: litrosVino,
          },
        },
      })

      if (signUpError) throw signUpError

      router.push("/registro-exitoso")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocurrió un error")
    } finally {
      setIsLoading(false)
    }
  }

  const departamentosDisponibles = provincia
  ? departamentosData[provincia] || []
  : []
  


  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl overflow-hidden p-0">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-3xl text-center">Registro COVIAR</CardTitle>
          <CardDescription className="text-primary-foreground/80 text-center">
            Crea tu cuenta para evaluar la sostenibilidad de tu bodega o viñedo
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Administrator Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold border-b pb-2">Perfil del Administrador</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-first-name">Nombre *</Label>
                  <Input
                    id="admin-first-name"
                    required
                    value={adminFirstName}
                    onChange={(e) => setAdminFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-last-name">Apellido *</Label>
                  <Input
                    id="admin-last-name"
                    required
                    value={adminLastName}
                    onChange={(e) => setAdminLastName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-role">Rol</Label>
                  <Input id="admin-role" value={adminRole} onChange={(e) => setAdminRole(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-phone">Celular</Label>
                  <Input
                    id="admin-phone"
                    type="tel"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Información bodega */}
 
            <div className="space-y-4">
              <h3 className="text-xl font-semibold border-b pb-2">Datos de la Bodega/Viñedo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="razon-social">Razón Social *</Label>
                  <Input
                    id="razon-social"
                    required
                    value={razonSocial}
                    onChange={(e) => setRazonSocial(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombre-fantasia">Nombre de Fantasía</Label>
                  <Input
                    id="nombre-fantasia"
                    value={nombreFantasia}
                    onChange={(e) => setNombreFantasia(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cuit">CUIT</Label>
                  <Input id="cuit" value={cuit} onChange={(e) => setCuit(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bodega-inv">Nº de Bodega INV</Label>
                  <Input id="bodega-inv" value={bodegaInv} onChange={(e) => setBodegaInv(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vinedo-inv">Nº de Viñedo INV</Label>
                  <Input id="vinedo-inv" value={vinedoInv} onChange={(e) => setVinedoInv(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="litros-vino">Litros de Vino Elaborado</Label>
                  <Select value={litrosVino} onValueChange={setLitrosVino}>
                    <SelectTrigger id="litros-vino" className="h-10 w-full">
                      <SelectValue placeholder="Selecciona un rango" />
                    </SelectTrigger>
                    <SelectContent>
                      {litrosVinoRango.map((rango) => (
                        <SelectItem key={rango} value={rango}>
                          {rango}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provincia">Provincia *</Label>
                  <Select value={provincia} onValueChange={handleProvinciaChange} required>
                    <SelectTrigger id="provincia" className="h-10 w-full">
                      <SelectValue placeholder="Selecciona una provincia" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinciasArgentina.map((prov) => (
                        <SelectItem key={prov} value={prov}>
                          {prov}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento / Comuna / Partido *</Label>
                  <Select
                    value={departamento}
                    onValueChange={setDepartamento}
                    disabled={!provincia}
                  >
                    <SelectTrigger id="departamento" className="h-10 w-full">
                      <SelectValue
                        placeholder={
                          provincia
                            ? "Selecciona un departamento"
                            : "Selecciona primero una provincia"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {departamentosDisponibles.map((dep) => (
                        <SelectItem key={dep} value={dep}>
                          {dep}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigo-postal">Código Postal</Label>
                  <Input id="codigo-postal" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distrito">Distrito</Label>
                  <Input id="distrito" value={distrito} onChange={(e) => setDistrito(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calle-numeracion">Calle/Numeración</Label>
                  <Input id="calle-numeracion" value={calleNumeracion} onChange={(e) => setCalleNumeracion(e.target.value)} />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Actividades y Experiencias</Label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {actividadesOptions.map((actividad) => (
                    <div key={actividad} className="flex items-center space-x-2">
                      <Checkbox
                        id={actividad}
                        checked={actividades.includes(actividad)}
                        onCheckedChange={() => handleActivityToggle(actividad)}
                      />
                      <label
                        htmlFor={actividad}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {actividad}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4 p-2">
                  <Label htmlFor="password">Contraseña *</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-4 p-2">
                  <Label htmlFor="confirm-password">Confirmar Contraseña *</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>

            <div className="text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Inicia sesión
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}