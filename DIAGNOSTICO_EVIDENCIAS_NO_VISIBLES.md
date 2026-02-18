# 🔍 Diagnóstico: Evidencias No Visibles

## 🎯 Problema Actual

Los archivos están guardados físicamente en el servidor (`./evidencias/22`), pero **NO se muestran** en el frontend cuando el usuario vuelve a la autoevaluación.

---

## ✅ Mejoras Implementadas - LOGGING DETALLADO

He agregado logging exhaustivo en toda la cadena de carga de evidencias para identificar exactamente dónde falla:

### 1. **Proxy GET Evidencias** (Frontend → Backend)

**Archivo:** `app/api/autoevaluaciones/[id]/respuestas/[idRespuesta]/evidencias/route.ts`

```typescript
// Al hacer GET
console.log(`📋 Proxy evidencias: GET ${backendUrl}`)

// Si hay error
console.error(`❌ Proxy evidencias: GET Error ${response.status}`, data)

// Si es exitoso
console.log(`✅ Proxy evidencias: GET exitoso para respuesta ${idRespuesta}`, JSON.stringify(data))
```

### 2. **Función obtenerEvidencia** (Cliente)

**Archivo:** `lib/api/autoevaluacion.ts`

```typescript
// Al iniciar
console.log(`📋 obtenerEvidencia: GET ${url}`)

// Al recibir respuesta
console.log(`📦 obtenerEvidencia: Respuesta recibida`, JSON.stringify(data))

// Si encuentra evidencia
console.log(`✅ Evidencia encontrada en data.evidencia: ${nombre_archivo}`)
console.log(`✅ Evidencia encontrada en data.evidencias[0]: ${nombre_archivo}`)
console.log(`✅ Evidencia encontrada directamente en data: ${nombre_archivo}`)

// Si NO encuentra
console.warn(`⚠️ obtenerEvidencia: Estructura de respuesta no reconocida. Keys:`, Object.keys(data))
```

### 3. **Función cargarEvidenciasExistentes**

**Archivo:** `app/dashboard/autoevaluacion/page.tsx`

```typescript
// Al iniciar
console.log('🔄 Cargando evidencias existentes...')
console.log('📋 Mapa de respuestas:', respuestaIdMap)

// Para cada evidencia
console.log(`🔍 Buscando evidencia para indicador ${idIndicador}, respuesta ${idRespuesta}`)
console.log(`📎 Evidencia cargada para indicador ${idIndicador}: ${nombre}`)

// Resumen final
console.log(`📊 Resumen: ${cargadas} evidencias cargadas, ${errores} errores`)
console.log(`✅ Estado actualizado con ${count} evidencias`, evidenciasMap)
```

---

## 🧪 Cómo Diagnosticar el Problema

### Paso 1: Abrir DevTools
1. Presiona `F12` en el navegador
2. Ve a la pestaña **Console**
3. Mantén la consola abierta

### Paso 2: Reproducir el Problema
1. **Cierra sesión** si estás logueado
2. **Inicia sesión** nuevamente
3. **Continúa** con la autoevaluación pendiente que tiene evidencias subidas
4. Observa los logs en la consola

### Paso 3: Analizar los Logs

Deberías ver una secuencia como esta:

```
🔄 Cargando evidencias existentes...
📋 Mapa de respuestas: {123: 5678, 456: 5679}
🔍 Buscando evidencia para indicador 123, respuesta 5678
📋 obtenerEvidencia: GET /api/autoevaluaciones/22/respuestas/5678/evidencias
📋 Proxy evidencias: GET http://localhost:8080/api/autoevaluaciones/22/respuestas/5678/evidencias
✅ Proxy evidencias: GET exitoso para respuesta 5678 {...datos...}
📦 obtenerEvidencia: Respuesta recibida {...datos...}
✅ Evidencia encontrada en data.evidencia: test1.pdf
📎 Evidencia cargada para indicador 123: test1.pdf
📊 Resumen: 1 evidencias cargadas, 0 errores
✅ Estado actualizado con 1 evidencias {123: "test1.pdf"}
📁 Inicializando archivo existente para indicador 123: test1.pdf
```

---

## 🔴 Posibles Problemas y Soluciones

### Problema 1: ⚠️ No hay respuestas con id_respuesta

**Log:**
```
⚠️ No hay respuestas con id_respuesta, no se pueden cargar evidencias
```

**Causa:** El backend no está devolviendo `id_respuesta` en las respuestas guardadas.

**Solución Backend:** Asegurar que el endpoint GET respuestas incluya el campo `id_respuesta`:
```json
{
  "id_respuesta": 5678,      // ← REQUERIDO
  "id_indicador": 123,
  "id_nivel_respuesta": 2
}
```

---

### Problema 2: ❌ Error al obtener evidencias (404)

**Log:**
```
ℹ️ No hay evidencia para respuesta 5678 (404)
```

**Causa:** El backend no encuentra la evidencia para ese `id_respuesta`.

**Verificar Backend:**
1. Verificar que el directorio `./evidencias/22` contenga archivos
2. Verificar que la base de datos tenga registros de evidencias
3. Query de ejemplo:
   ```sql
   SELECT * FROM evidencias WHERE id_autoevaluacion = 22;
   ```

---

### Problema 3: ⚠️ Estructura de respuesta no reconocida

**Log:**
```
⚠️ obtenerEvidencia: Estructura de respuesta no reconocida. Keys: [...]
⚠️ Datos completos: {...}
```

**Causa:** El backend está devolviendo un formato diferente al esperado.

**Formatos esperados:**
```javascript
// Opción 1: Objeto con propiedad evidencia
{
  "evidencia": {
    "id_evidencia": 1,
    "nombre_archivo": "test1.pdf",    // ← IMPORTANTE
    "tipo_archivo": "application/pdf",
    "tamano": 12345,
    ...
  }
}

// Opción 2: Array de evidencias
{
  "evidencias": [
    {
      "nombre_archivo": "test1.pdf",  // ← IMPORTANTE
      ...
    }
  ]
}

// Opción 3: Objeto directo
{
  "id_evidencia": 1,
  "nombre_archivo": "test1.pdf",      // ← IMPORTANTE o "nombre"
  ...
}
```

**Solución:** Copiar los logs y compartir la estructura exacta que devuelve el backend.

---

### Problema 4: ⚠️ Evidencia existe pero sin nombre_archivo

**Log:**
```
⚠️ Evidencia existe pero sin nombre_archivo para indicador 123: {...}
```

**Causa:** El backend devuelve el objeto evidencia pero el campo del nombre está con otro nombre.

**Solución:** El código ahora también acepta `nombre` (se normaliza a `nombre_archivo`), pero verificar los logs para ver qué campos tiene el objeto.

---

### Problema 5: 📊 Resumen: 0 evidencias cargadas

**Log:**
```
📊 Resumen: 0 evidencias cargadas, X errores
ℹ️ No se encontraron evidencias para cargar
```

**Causa:** Ninguna evidencia se cargó exitosamente.

**Pasos:**
1. Revisar los logs anteriores para cada indicador
2. Identificar si todos devuelven 404 o tienen otro error
3. Verificar la base de datos del backend

---

## 📝 Información a Recolectar

Si el problema persiste, necesito que me compartas:

### 1. **Logs Completos de la Consola**

Desde que haces clic en "Continuar" hasta que se muestra la pantalla de autoevaluación.

### 2. **Estructura de Respuesta del Backend**

Específicamente, qué devuelve:
```
GET /api/autoevaluaciones/22/respuestas/[ID_RESPUESTA]/evidencias
```

Ejemplo de cómo obtenerlo:
- En DevTools → Network
- Busca la llamada a `evidencias`
- Ve a la pestaña "Response"
- Copia el JSON completo

### 3. **Verificación de Base de Datos Backend**

```sql
-- Ver evidencias guardadas
SELECT * FROM evidencias WHERE id_autoevaluacion = 22;

-- Ver respuestas guardadas
SELECT id_respuesta, id_indicador, id_nivel_respuesta 
FROM respuestas 
WHERE id_autoevaluacion = 22;
```

### 4. **Verificación de Archivos Físicos**

```bash
# Listar archivos en el directorio
ls -la ./evidencias/22/
# o en Windows
dir .\evidencias\22\
```

---

## 🔧 Configuración del Backend

El backend debe:

1. **Endpoint GET evidencias por respuesta:**
   ```
   GET /api/autoevaluaciones/{id}/respuestas/{idRespuesta}/evidencias
   ```

2. **Respuesta esperada:**
   ```json
   {
     "evidencia": {
       "id_evidencia": 123,
       "id_autoevaluacion": 22,
       "id_indicador": 456,
       "nombre_archivo": "test1.pdf",      // ← CRÍTICO
       "tipo_archivo": "application/pdf",
       "tamano": 12345,
       "fecha_subida": "2026-02-18T10:30:00"
     }
   }
   ```

3. **Alternativa (también válida):**
   ```json
   {
     "evidencias": [
       {
         "nombre_archivo": "test1.pdf",   // ← CRÍTICO
         ...
       }
     ]
   }
   ```

4. **Si NO existe evidencia:**
   - Devolver HTTP 404
   - El frontend manejará esto correctamente

---

## ✅ Siguiente Paso

**Ejecuta la prueba ahora:**

1. Abre la consola (F12)
2. Cierra sesión
3. Inicia sesión
4. Continúa con la autoevaluación que tiene evidencias
5. **Copia TODOS los logs** que veas en la consola
6. Compártelos conmigo

Con esos logs podré identificar **exactamente** dónde está fallando.

---

**Fecha:** 18 de Febrero de 2026  
**Estado:** 🔍 Diagnóstico en Progreso  
**Prioridad:** 🔴 Alta
