# 🔍 Diagnóstico y Solución: Evidencias en Autoevaluación

## 📋 Problema Reportado

1. **Error 500** al subir evidencias
2. **Falta de feedback visual** al regresar a una autoevaluación pendiente con evidencias ya subidas
3. Los archivos subidos no se mostraban después de cerrar sesión y volver

## ✅ Correcciones Implementadas

### 1. **Bug Crítico Corregido** - Campo incorrecto de evidencia
**Archivo:** `app/dashboard/autoevaluacion/page.tsx` (línea 287)

**Antes:**
```typescript
if (evidencia?.nombre) {
  evidenciasMap[parseInt(idIndicadorStr)] = evidencia.nombre
}
```

**Después:**
```typescript
if (evidencia?.nombre_archivo) {
  evidenciasMap[parseInt(idIndicadorStr)] = evidencia.nombre_archivo
}
```

**Impacto:** Los archivos ya subidos ahora se cargan y muestran correctamente al continuar una evaluación pendiente.

---

### 2. **Mejora en Manejo de Errores**
**Archivo:** `components/autoevaluacion/evidencia-upload.tsx`

- ✅ Mensajes de error más descriptivos y específicos
- ✅ Detección especial de errores 500 con contexto adicional
- ✅ Logging detallado para debugging (`console.log` con emojis para fácil identificación)
- ✅ Sugerencias de acción para el usuario cuando ocurre error 500

**Nuevo mensaje para error 500:**
```
Error del servidor. Verifica que el archivo sea un PDF válido y no exceda 2 MB. 
Si el problema persiste, contacta al administrador.
```

---

### 3. **Botón de Descarga Agregado**
**Archivo:** `components/autoevaluacion/evidencia-upload.tsx`

Ahora los archivos ya subidos muestran 3 acciones:
- 📥 **Descargar** - Para verificar el contenido del archivo
- 🔄 **Reemplazar** - Para subir una nueva versión
- 🗑️ **Eliminar** - Para quitar la evidencia

---

### 4. **Logging Mejorado en Proxy**
**Archivo:** `app/api/autoevaluaciones/[id]/respuestas/[idRespuesta]/evidencias/route.ts`

Ahora registra en consola:
- ✅ URL exacta del backend
- ✅ Tamaño del archivo en bytes
- ✅ Content-Type del request
- ✅ Datos completos de respuesta de error
- ✅ Advertencia específica para errores 500

---

### 5. **Persistencia Visual Mejorada**

El componente ahora:
- ✅ Inicializa correctamente con archivos existentes
- ✅ Limpia errores previos al mostrar archivo existente
- ✅ Mantiene el estado visual entre navegaciones
- ✅ Logging de inicialización y reseteo

---

## 🔴 Sobre el Error 500

### ⚠️ **IMPORTANTE: El error 500 NO es del frontend**

El error 500 proviene del **backend**. El frontend ahora está correctamente configurado para:
1. Enviar los archivos en formato correcto (multipart/form-data)
2. Manejar y mostrar los errores apropiadamente
3. Registrar información útil para debugging

### 🔍 Para Diagnosticar el Error 500 del Backend

Revisa los logs del servidor backend cuando ocurra el error. Posibles causas:

1. **Permisos de escritura**
   - Verifica que el directorio de evidencias tenga permisos de escritura
   - Verifica que el usuario del servidor pueda crear archivos

2. **Validaciones del backend**
   - Verifica que el backend acepte el campo 'file' en multipart/form-data
   - Verifica límites de tamaño configurados en el servidor
   - Verifica validaciones de tipo MIME

3. **Base de datos**
   - Verifica conexión a la base de datos
   - Verifica que las tablas de evidencias existan
   - Verifica constraints e integridad referencial

4. **Configuración del servidor**
   - Verifica límites de body size en el servidor web
   - Verifica timeouts
   - Verifica que la ruta del API sea correcta

### 📊 Logs a Revisar

Cuando ocurra el error, verás en la consola del navegador:
```
❌ Error al subir evidencia para indicador X: Error 500...
```

Y en la consola del servidor Next.js:
```
❌ Proxy evidencias: Error 500
   Backend URL: http://localhost:8080/api/autoevaluaciones/.../evidencias
   File size: XXXX bytes
   Response data: {...}
   Content-Type: multipart/form-data; boundary=...
   ⚠️  Error 500 del backend - revisar logs del servidor
```

Copia estos logs y revisa el backend para identificar la causa raíz.

---

## 🧪 Cómo Verificar las Mejoras

### Test 1: Persistencia de Evidencias
1. Inicia sesión y comienza una autoevaluación
2. Selecciona una respuesta en cualquier indicador
3. Sube un archivo PDF de evidencia
4. **Si hay error 500**: el mensaje ahora es más claro
5. **Si sube correctamente**: verás el archivo con icono verde
6. Sal de la autoevaluación (sin completarla)
7. Cierra sesión
8. Vuelve a iniciar sesión
9. Continúa la autoevaluación pendiente
10. ✅ **Resultado esperado**: Debes ver el archivo subido con su nombre completo

### Test 2: Acciones sobre Evidencias
Con un archivo ya subido:
1. Haz clic en el ícono de **descarga** 📥 - debe descargar el PDF
2. Haz clic en el ícono de **reemplazo** 🔄 - permite subir otro archivo
3. Haz clic en el ícono de **eliminar** 🗑️ - pide confirmación y elimina

---

## 🎨 Feedback Visual Implementado

### Estados del Componente de Evidencia:

1. **Idle** (Sin archivo)
   - Botón "Adjuntar evidencia (PDF)"
   - Texto de ayuda: "Formato: PDF · Tamaño máximo: 2 MB"

2. **Uploading** (Subiendo)
   - Barra de progreso animada
   - Porcentaje mostrado
   - Texto: "Procesando..." → "Subiendo archivo..." → "Finalizando..."

3. **Success** (Recién subido)
   - Fondo verde
   - Ícono de check
   - Mensaje: "Evidencia cargada exitosamente"
   - Transición automática a "has-file" en 2.5s

4. **Has-file** (Archivo existente) ⭐ **MEJORADO**
   - Fondo verde claro
   - Ícono de documento
   - Nombre completo del archivo
   - 3 botones de acción (Descargar, Reemplazar, Eliminar)

5. **Error** (Falló la subida) ⭐ **MEJORADO**
   - Fondo rojo
   - Mensaje de error descriptivo
   - Contexto adicional para error 500
   - Botón "Intentar de nuevo"

---

## 📝 Archivos Modificados

1. ✅ `app/dashboard/autoevaluacion/page.tsx` - Corrección del campo `nombre_archivo`
2. ✅ `components/autoevaluacion/evidencia-upload.tsx` - Mejoras en UI y manejo de errores
3. ✅ `app/api/autoevaluaciones/[id]/respuestas/[idRespuesta]/evidencias/route.ts` - Logging mejorado

---

## 🚀 Próximos Pasos

### Frontend (Completado ✅)
- ✅ Corrección del bug de carga de evidencias
- ✅ Mejora de mensajes de error
- ✅ Agregado botón de descarga
- ✅ Logging detallado

### Backend (Pendiente - **REQUIERE ATENCIÓN**)
Para resolver el error 500, el equipo de backend debe:

1. **Revisar logs del servidor** cuando ocurra el error
2. **Verificar permisos** del directorio de evidencias
3. **Verificar configuración** de multipart/form-data
4. **Verificar límites** de tamaño de archivo
5. **Agregar logging** más detallado en el endpoint de evidencias
6. **Verificar schema** de la base de datos

---

## 📞 Soporte

Si el error 500 persiste:
1. Captura los logs de la consola del navegador
2. Captura los logs del servidor Next.js
3. Captura los logs del servidor backend
4. Incluye el archivo PDF de prueba que estás usando
5. Reporta al equipo de backend con toda esta información

---

**Fecha de actualización:** 18 de Febrero de 2026  
**Estado:** Frontend optimizado ✅ | Backend requiere revisión ⚠️
