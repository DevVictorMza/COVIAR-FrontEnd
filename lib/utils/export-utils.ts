// lib/utils/export-utils.ts
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { AutoevaluacionHistorial, ResultadoDetallado } from '@/lib/api/types'

// ============= DATOS DE USUARIO =============

interface DatosUsuario {
    bodega: {
        nombre_fantasia: string
        razon_social: string
    }
    responsable: {
        nombre: string
        apellido: string
        cargo: string
        dni: string
    }
}

function obtenerDatosUsuario(): DatosUsuario {
    try {
        const usuarioStr = typeof window !== 'undefined' ? localStorage.getItem('usuario') : null
        if (!usuarioStr) return getDefaultDatos()
        const usuario = JSON.parse(usuarioStr)
        return {
            bodega: {
                nombre_fantasia: usuario.bodega?.nombre_fantasia || 'Bodega',
                razon_social: usuario.bodega?.razon_social || '',
            },
            responsable: {
                nombre: usuario.responsable?.nombre || '',
                apellido: usuario.responsable?.apellido || '',
                cargo: usuario.responsable?.cargo || '',
                dni: usuario.responsable?.dni || '',
            },
        }
    } catch {
        return getDefaultDatos()
    }
}

function getDefaultDatos(): DatosUsuario {
    return {
        bodega: { nombre_fantasia: 'Bodega', razon_social: '' },
        responsable: { nombre: '', apellido: '', cargo: '', dni: '' },
    }
}

// ============= CSV EXPORTS =============

/**
 * Exporta los datos del historial a un archivo CSV
 */
export function exportHistorialToCSV(
    evaluaciones: AutoevaluacionHistorial[],
    filename: string = 'historial_autoevaluaciones'
): void {
    const headers = [
        'ID',
        'Fecha',
        'Estado',
        'Segmento',
        'Puntaje Obtenido',
        'Puntaje Maximo',
        'Porcentaje',
        'Nivel de Sostenibilidad'
    ]

    const rows = evaluaciones.map(ev => [
        ev.id_autoevaluacion.toString(),
        formatDate(ev.fecha_inicio),
        capitalizeFirst(ev.estado),
        ev.nombre_segmento ?? '-',
        ev.puntaje_final?.toString() ?? '-',
        ev.puntaje_maximo?.toString() ?? '-',
        ev.porcentaje !== null ? `${ev.porcentaje}%` : '-',
        ev.nivel_sostenibilidad?.nombre ?? '-'
    ])

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;')
}

/**
 * Exporta una evaluacion detallada a CSV con capitulos e indicadores
 */
export function exportResultadoDetalladoToCSV(
    resultado: ResultadoDetallado,
    filename: string = 'evaluacion_detallada'
): void {
    const { autoevaluacion: ev, capitulos } = resultado

    const rows: string[][] = [
        ['Informacion de la Evaluacion'],
        ['ID', ev.id_autoevaluacion.toString()],
        ['Fecha', formatDate(ev.fecha_finalizacion || ev.fecha_inicio)],
        ['Segmento', ev.nombre_segmento ?? '-'],
        ['Puntaje Total', `${ev.puntaje_final ?? '-'} / ${ev.puntaje_maximo ?? '-'}`],
        ['Porcentaje', ev.porcentaje !== null ? `${ev.porcentaje}%` : '-'],
        ['Nivel', ev.nivel_sostenibilidad?.nombre ?? '-'],
        [''],
        ['Capitulo', 'Indicador', 'Descripcion', 'Respuesta', 'Puntos', 'Max'],
    ]

    for (const cap of capitulos) {
        if (cap.indicadores) {
            for (const ind of cap.indicadores) {
                rows.push([
                    cap.nombre,
                    ind.nombre,
                    ind.descripcion,
                    ind.respuesta_nombre,
                    ind.respuesta_puntos.toString(),
                    ind.puntaje_maximo.toString(),
                ])
            }
        }
    }

    const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;')
}

// ============= PDF EXPORTS =============

/**
 * Agrega el footer a todas las paginas del PDF
 */
function addFooter(doc: jsPDF): void {
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(150)
        const pageHeight = doc.internal.pageSize.height
        doc.text(
            `Pagina ${i} de ${pageCount}`,
            doc.internal.pageSize.width / 2,
            pageHeight - 10,
            { align: 'center' }
        )
        doc.setDrawColor(200)
        doc.line(14, pageHeight - 15, doc.internal.pageSize.width - 14, pageHeight - 15)
    }
}

/**
 * Exporta el historial completo a PDF - Estilo formal/institucional
 */
export function exportHistorialToPDF(
    evaluaciones: AutoevaluacionHistorial[],
    bodegaNombre: string = 'Bodega',
    filename: string = 'historial_autoevaluaciones'
): void {
    const doc = new jsPDF()
    const datos = obtenerDatosUsuario()
    const pageWidth = doc.internal.pageSize.width

    // === ENCABEZADO ===
    doc.setFontSize(15)
    doc.setTextColor(20)
    doc.setFont('helvetica', 'bold')
    doc.text('INFORME DE HISTORIAL DE AUTOEVALUACIONES', pageWidth / 2, 18, { align: 'center' })

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100)
    doc.text('Guia de Autoevaluacion de Sostenibilidad Enoturistica', pageWidth / 2, 24, { align: 'center' })

    // Linea doble debajo del titulo
    doc.setDrawColor(40)
    doc.setLineWidth(0.8)
    doc.line(14, 27, pageWidth - 14, 27)
    doc.setLineWidth(0.3)
    doc.line(14, 28.2, pageWidth - 14, 28.2)

    // === DATOS - Dos columnas dentro de un recuadro ===
    const boxTop = 32
    const colLeft = 18
    const colRight = pageWidth / 2 + 5
    const labelOff = 32
    let yL = boxTop + 7
    let yR = boxTop + 7
    const lH = 5.5

    const addLeft = (label: string, value: string) => {
        if (!value || value.trim() === '') return
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(60)
        doc.setFontSize(8)
        doc.text(label, colLeft, yL)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(30)
        doc.setFontSize(9)
        doc.text(value, colLeft + labelOff, yL)
        yL += lH
    }

    const addRight = (label: string, value: string) => {
        if (!value || value.trim() === '') return
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(60)
        doc.setFontSize(8)
        doc.text(label, colRight, yR)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(30)
        doc.setFontSize(9)
        doc.text(value, colRight + labelOff, yR)
        yR += lH
    }

    // Columna izquierda - Bodega
    addLeft('Bodega:', datos.bodega.nombre_fantasia)
    if (datos.bodega.razon_social && datos.bodega.razon_social !== datos.bodega.nombre_fantasia) {
        addLeft('Razon Social:', datos.bodega.razon_social)
    }
    addLeft('Fecha:', new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }))

    // Columna derecha - Responsable
    const nombreCompleto = `${datos.responsable.nombre} ${datos.responsable.apellido}`.trim()
    addRight('Responsable:', nombreCompleto || '-')
    addRight('Cargo:', datos.responsable.cargo || '-')
    addRight('DNI:', datos.responsable.dni || '-')

    // Recuadro
    const boxBottom = Math.max(yL, yR) + 3
    doc.setDrawColor(160)
    doc.setLineWidth(0.3)
    doc.roundedRect(14, boxTop, pageWidth - 28, boxBottom - boxTop, 1.5, 1.5, 'S')

    // Linea vertical separadora
    doc.setDrawColor(200)
    doc.setLineWidth(0.2)
    doc.line(pageWidth / 2 + 1, boxTop + 4, pageWidth / 2 + 1, boxBottom - 3)

    let y = boxBottom + 4

    // === TABLA DE EVALUACIONES ===
    const tableData = evaluaciones.map((ev, index) => [
        `#${evaluaciones.length - index}`,
        formatDateShort(ev.fecha_finalizacion || ev.fecha_inicio),
        ev.nombre_segmento ?? '-',
        `${ev.puntaje_final ?? '-'} / ${ev.puntaje_maximo ?? '-'}`,
        ev.porcentaje !== null ? `${ev.porcentaje}%` : '-',
        ev.nivel_sostenibilidad?.nombre ?? '-'
    ])

    autoTable(doc, {
        startY: y + 5,
        head: [['N.', 'Fecha', 'Segmento', 'Puntaje', '%', 'Nivel']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: [50, 50, 50],
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 9,
        },
        styles: {
            fontSize: 9,
            cellPadding: 3,
            textColor: [30, 30, 30],
            lineColor: [180, 180, 180],
            lineWidth: 0.3,
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245],
        },
    })

    addFooter(doc)
    doc.save(`${filename}.pdf`)
}

/**
 * Exporta una evaluacion detallada a PDF - Estilo formal/institucional
 * Incluye: bodega, responsable, todos los indicadores con su respuesta,
 * y al final el puntaje total y nivel de sostenibilidad.
 */
export function exportResultadoDetalladoToPDF(
    resultado: ResultadoDetallado,
    _bodegaNombre: string = 'Bodega',
    filename: string = 'evaluacion_detallada'
): void {
    const doc = new jsPDF()
    const { autoevaluacion: ev, capitulos } = resultado
    const datos = obtenerDatosUsuario()
    const pageWidth = doc.internal.pageSize.width

    // === ENCABEZADO ===
    doc.setFontSize(15)
    doc.setTextColor(20)
    doc.setFont('helvetica', 'bold')
    doc.text('INFORME DE AUTOEVALUACION DE SOSTENIBILIDAD', pageWidth / 2, 18, { align: 'center' })

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100)
    doc.text('Guia de Autoevaluacion de Sostenibilidad Enoturistica', pageWidth / 2, 24, { align: 'center' })

    // Linea gruesa debajo del titulo
    doc.setDrawColor(40)
    doc.setLineWidth(0.8)
    doc.line(14, 27, pageWidth - 14, 27)
    doc.setLineWidth(0.3)
    doc.line(14, 28.2, pageWidth - 14, 28.2)

    // === DATOS GENERALES - Dos columnas dentro de un recuadro ===
    const boxTop = 32
    const colLeft = 18
    const colRight = pageWidth / 2 + 5
    const labelOffset = 32
    let yLeft = boxTop + 7
    let yRight = boxTop + 7
    const lineH = 5.5

    const addFieldLeft = (label: string, value: string) => {
        if (!value || value.trim() === '') return
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(60)
        doc.setFontSize(8)
        doc.text(label, colLeft, yLeft)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(30)
        doc.setFontSize(9)
        doc.text(value, colLeft + labelOffset, yLeft)
        yLeft += lineH
    }

    const addFieldRight = (label: string, value: string) => {
        if (!value || value.trim() === '') return
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(60)
        doc.setFontSize(8)
        doc.text(label, colRight, yRight)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(30)
        doc.setFontSize(9)
        doc.text(value, colRight + labelOffset, yRight)
        yRight += lineH
    }

    // Columna izquierda - Bodega
    addFieldLeft('Bodega:', datos.bodega.nombre_fantasia)
    if (datos.bodega.razon_social && datos.bodega.razon_social !== datos.bodega.nombre_fantasia) {
        addFieldLeft('Razon Social:', datos.bodega.razon_social)
    }
    addFieldLeft('Segmento:', ev.nombre_segmento || '-')
    addFieldLeft('Fecha:', formatDate(ev.fecha_finalizacion || ev.fecha_inicio))

    // Columna derecha - Responsable
    const nombreCompleto = `${datos.responsable.nombre} ${datos.responsable.apellido}`.trim()
    addFieldRight('Responsable:', nombreCompleto || '-')
    addFieldRight('Cargo:', datos.responsable.cargo || '-')
    addFieldRight('DNI:', datos.responsable.dni || '-')

    // Recuadro alrededor de los datos
    const boxBottom = Math.max(yLeft, yRight) + 3
    doc.setDrawColor(160)
    doc.setLineWidth(0.3)
    doc.roundedRect(14, boxTop, pageWidth - 28, boxBottom - boxTop, 1.5, 1.5, 'S')

    // Linea vertical separando las dos columnas
    doc.setDrawColor(200)
    doc.setLineWidth(0.2)
    doc.line(pageWidth / 2 + 1, boxTop + 4, pageWidth / 2 + 1, boxBottom - 3)

    let y = boxBottom + 6

    // === TABLA UNIFICADA DE INDICADORES POR CAPITULO ===
    // Construir filas con rowSpan para agrupar por capitulo
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tableBody: any[][] = []

    for (const cap of capitulos) {
        const indicadores = cap.indicadores ?? []
        const rowCount = Math.max(indicadores.length, 1)
        const puntajeCapStr = `${cap.puntaje_obtenido} / ${cap.puntaje_maximo}`

        if (indicadores.length === 0) {
            tableBody.push([
                { content: cap.nombre, rowSpan: 1, styles: { fontStyle: 'bold', valign: 'middle' } },
                '-',
                '-',
                '-',
                '-',
                { content: puntajeCapStr, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold', valign: 'middle' } },
            ])
        } else {
            indicadores.forEach((ind, idx) => {
                const row: any[] = [] // eslint-disable-line @typescript-eslint/no-explicit-any
                if (idx === 0) {
                    row.push({ content: cap.nombre, rowSpan: rowCount, styles: { fontStyle: 'bold', valign: 'middle' } })
                }
                row.push(ind.nombre)
                row.push(ind.descripcion || '-')
                row.push(ind.respuesta_nombre || '-')
                row.push({ content: ind.respuesta_puntos.toString(), styles: { halign: 'center' } })
                if (idx === 0) {
                    row.push({ content: puntajeCapStr, rowSpan: rowCount, styles: { halign: 'center', fontStyle: 'bold', valign: 'middle' } })
                }
                tableBody.push(row)
            })
        }
    }

    autoTable(doc, {
        startY: y,
        head: [['Capitulo', 'Indicador', 'Descripcion', 'Nivel de Indicador', 'Pts', 'Puntaje Capitulo']],
        body: tableBody,
        theme: 'grid',
        headStyles: {
            fillColor: [50, 50, 50],
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 8,
            halign: 'center',
        },
        styles: {
            fontSize: 7.5,
            cellPadding: 2.5,
            textColor: [30, 30, 30],
            lineColor: [180, 180, 180],
            lineWidth: 0.3,
            overflow: 'linebreak',
        },
        alternateRowStyles: {
            fillColor: [248, 248, 248],
        },
        columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 22 },
            2: { cellWidth: 52 },
            3: { cellWidth: 35 },
            4: { cellWidth: 14, halign: 'center' },
            5: { cellWidth: 28, halign: 'center' },
        },
        margin: { left: 14, right: 14 },
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 8

    // === RESULTADO FINAL ===
    if (y > doc.internal.pageSize.height - 50) {
        doc.addPage()
        y = 20
    }

    // === RESULTADO FINAL - Recuadro con doble linea ===
    doc.setDrawColor(40)
    doc.setLineWidth(0.8)
    doc.line(14, y, pageWidth - 14, y)
    doc.setLineWidth(0.3)
    doc.line(14, y + 1.2, pageWidth - 14, y + 1.2)
    y += 7

    const nivelNombre = ev.nivel_sostenibilidad?.nombre ?? '-'

    // Calcular altura dinámica del recuadro
    // Primera fila: titulo "RESULTADO FINAL" (10px)
    // Segunda fila: Puntaje Total + Porcentaje (6px)
    // Tercera fila: Nivel alcanzado con texto que puede ser largo
    const nivelMaxWidth = pageWidth - 28 - 12 - 36 // margen - padding - label
    const nivelLines = doc.splitTextToSize(nivelNombre, nivelMaxWidth)
    const nivelHeight = nivelLines.length * 5
    const resBoxHeight = 10 + 8 + nivelHeight + 8

    const resBoxTop = y - 2
    doc.setFillColor(248, 248, 248)
    doc.roundedRect(14, resBoxTop, pageWidth - 28, resBoxHeight, 1.5, 1.5, 'F')
    doc.setDrawColor(120)
    doc.setLineWidth(0.4)
    doc.roundedRect(14, resBoxTop, pageWidth - 28, resBoxHeight, 1.5, 1.5, 'S')

    // Titulo
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(20)
    doc.text('RESULTADO FINAL', 20, y + 4)

    // Puntaje y Porcentaje en la misma linea
    const resY = y + 14

    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(60)
    doc.text('Puntaje Total:', 20, resY)
    doc.setTextColor(20)
    doc.setFontSize(10)
    doc.text(`${ev.puntaje_final ?? '-'} / ${ev.puntaje_maximo ?? '-'}`, 52, resY)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(60)
    doc.text('Porcentaje:', 90, resY)
    doc.setTextColor(20)
    doc.setFontSize(10)
    doc.text(ev.porcentaje !== null ? `${ev.porcentaje}%` : '-', 115, resY)

    // Nivel en su propia linea para que no se desborde
    const nivelY = resY + 8
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(60)
    doc.text('Nivel alcanzado:', 20, nivelY)
    doc.setTextColor(20)
    doc.setFontSize(10)
    doc.text(nivelLines, 56, nivelY)

    addFooter(doc)
    doc.save(`${filename}.pdf`)
}

// ============= HELPERS =============

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

function formatDateShort(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

function capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

function downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}
