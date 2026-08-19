import jsPDF from 'jspdf';
import { TaxUserData } from '../types';
import { TAX_CONSTANTS, THRESHOLD_LIMITS } from '../data/constants';
import { getDueDateByCedula } from '../data/calendarData';
import { HERO_DOCUMENTS } from '../data/inventoryData';

export function generateTaxReportPDF(userData: TaxUserData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = 14;

  // Helper formatting
  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const checkThreshold = (val: number, limit: number) => (val || 0) >= limit;

  const hasExceededAny = 
    checkThreshold(userData.patrimonioBruto, 224095500) ||
    checkThreshold(userData.ingresosBrutos, 69718600) ||
    checkThreshold(userData.consumosTarjeta, 69718600) ||
    checkThreshold(userData.comprasTotales, 69718600) ||
    checkThreshold(userData.consignacionesBancarias, 69718600);

  const isObligated = userData.isSimpleRegime 
    ? false 
    : !userData.isTaxResident 
      ? false 
      : hasExceededAny;

  const applicableForm = userData.isSimpleRegime
    ? 'Formulario 260 (Régimen Simple)'
    : userData.isTaxResident
      ? 'Formulario 210 (Personas Naturales Residentes)'
      : 'Formulario 110 (No Residentes con ingresos sin retención)';

  const calendarInfo = getDueDateByCedula(userData.cedula || '01');

  // --- HEADER BANNER ---
  doc.setFillColor(30, 41, 59); // Slate-800 (#1e293b)
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('RENTA QUEST 2026 | INFORME TRIBUTARIO DIAN', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('Diagnóstico Oficial de Obligación de Declarar Renta - Año Gravable 2025 (Declarado en 2026)', margin, 18);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, 23);

  // Brand tag on top right
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(245, 158, 11); // amber-500
  doc.text('Contabilidad A&C', pageWidth - margin, 14, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(226, 232, 240);
  doc.setFontSize(8);
  doc.text('+57 316 628 1699 | info@contabilidadayc.com.co', pageWidth - margin, 20, { align: 'right' });

  y = 34;

  // --- USER SUMMARY CARD ---
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, y, pageWidth - margin * 2, 24, 2, 2, 'FD');

  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text('Contribuyente / Jugador:', margin + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(userData.playerName || 'Persona Natural Consultante', margin + 48, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('Perfil / Categoría:', margin + 4, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(userData.playerProfileCategory || 'No especificada', margin + 36, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.text('Cédula / NIT:', margin + 4, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.text(userData.cedula ? `${userData.cedula} (Dígitos: ${calendarInfo.digits})` : 'No especificada', margin + 28, y + 18);

  doc.setFont('helvetica', 'bold');
  doc.text('Salud Tributaria:', pageWidth - margin - 52, y + 6);
  doc.setFont('helvetica', 'bold');
  const healthColor = userData.taxHealth >= 80 ? [15, 118, 110] : userData.taxHealth >= 50 ? [217, 119, 6] : [220, 38, 38];
  doc.setTextColor(healthColor[0], healthColor[1], healthColor[2]);
  doc.text(`${userData.taxHealth}/100`, pageWidth - margin - 14, y + 6);

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Residencia Fiscal: ${userData.isTaxResident ? 'RESIDENTE' : 'NO RESIDENTE'} (Art. 10 E.T.)`, pageWidth - margin - 75, y + 13);
  doc.text(`Fecha Límite DIAN: ${calendarInfo.dueDate}`, pageWidth - margin - 75, y + 19);

  y += 28;

  // --- MAIN VERDICT CALLOUT ---
  if (userData.isSimpleRegime) {
    doc.setFillColor(238, 242, 255); // indigo-50
    doc.setDrawColor(99, 102, 241); // indigo-500
    doc.roundedRect(margin, y, pageWidth - margin * 2, 18, 2, 2, 'FD');
    doc.setTextColor(67, 56, 202);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('RÉGIMEN SIMPLE DE TRIBUTACIÓN (RST)', margin + 4, y + 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(55, 48, 163);
    doc.text('Estás exento del impuesto sobre la renta ordinario. Declaras anualmente mediante el Formulario 260.', margin + 4, y + 13);
  } else if (isObligated) {
    doc.setFillColor(254, 242, 242); // red-50
    doc.setDrawColor(239, 68, 68); // red-500
    doc.roundedRect(margin, y, pageWidth - margin * 2, 20, 2, 2, 'FD');
    doc.setTextColor(185, 28, 28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('DIAGNÓSTICO: OBLIGADO A DECLARAR RENTA', margin + 4, y + 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(127, 29, 29);
    doc.text(`Superaste uno o más topes de la ley colombiana para el año gravable 2025.`, margin + 4, y + 12);
    doc.text(`Formulario aplicable: ${applicableForm}`, margin + 4, y + 17);
  } else {
    doc.setFillColor(240, 253, 244); // green-50
    doc.setDrawColor(34, 197, 94); // green-500
    doc.roundedRect(margin, y, pageWidth - margin * 2, 20, 2, 2, 'FD');
    doc.setTextColor(21, 128, 61);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('DIAGNÓSTICO: NO OBLIGADO POR TOPES', margin + 4, y + 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(20, 83, 45);
    doc.text('Ninguna de tus transacciones o patrimonios superó los umbrales fijados por la DIAN para 2025.', margin + 4, y + 12);
    doc.text('Nota: Si te practicaron retenciones en la fuente, puedes declarar voluntariamente para solicitar saldo a favor.', margin + 4, y + 17);
  }

  y += 24;

  // --- CALENDAR & SANCTION BOX ---
  doc.setFillColor(254, 243, 199); // amber-100
  doc.setDrawColor(217, 119, 6); // amber-600
  doc.roundedRect(margin, y, pageWidth - margin * 2, 19, 2, 2, 'FD');

  doc.setTextColor(146, 64, 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(`FECHA LÍMITE DE VENCIMIENTO DIAN: ${calendarInfo.dueDate.toUpperCase()}`, margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 53, 15);
  doc.text(`Asignada según los dígitos [${calendarInfo.digits}] de tu cédula/NIT.`, margin + 4, y + 11);
  doc.setFont('helvetica', 'bold');
  doc.text(`SANCIÓN MÍNIMA POR EXTEMPORANEIDAD 2026: $523.740 COP (10 UVT 2026 de $52.374) + Intereses moratorios.`, margin + 4, y + 16);

  y += 23;

  // --- TABLE OF THRESHOLDS ---
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('EVALUACIÓN DE TOPES MONETARIOS - AÑO GRAVABLE 2025 (UVT $49.799)', margin, y);
  y += 4;

  // Table Header
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, y, pageWidth - margin * 2, 6.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.text('Concepto Evaluado', margin + 2, y + 4.5);
  doc.text('Fórmula Base', margin + 65, y + 4.5);
  doc.text('Límite Ley (COP)', margin + 92, y + 4.5);
  doc.text('Tu Valor Reportado', margin + 128, y + 4.5);
  doc.text('Estado', pageWidth - margin - 18, y + 4.5);

  y += 6.5;

  THRESHOLD_LIMITS.forEach((item, idx) => {
    const userVal = Number(userData[item.valueKey]) || 0;
    const isExceeded = userVal >= item.limitCop;

    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, pageWidth - margin * 2, 7.5, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(item.label, margin + 2, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`${item.uvtCount.toLocaleString('es-CO')} UVT`, margin + 65, y + 5);
    doc.text(formatCOP(item.limitCop), margin + 92, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(formatCOP(userVal), margin + 128, y + 5);

    if (isExceeded) {
      doc.setTextColor(220, 38, 38);
      doc.text('SUPERA', pageWidth - margin - 18, y + 5);
    } else {
      doc.setTextColor(15, 118, 110);
      doc.text('DENTRO', pageWidth - margin - 18, y + 5);
    }

    y += 7.5;
  });

  y += 4;

  // --- SPECIAL VALUE-ADD MODULES ---
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('BENEFICIOS Y ANÁLISIS PATRIMONIAL:', margin, y);
  y += 4;

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 17, 1.5, 1.5, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 118, 110);
  doc.text('• Beneficio Factura Electrónica (1% Deducción - Art. 336 E.T.):', margin + 3, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text('Puedes deducir hasta 240 UVT ($11.951.760) por compras soportadas en factura electrónica con medio electrónico.', margin + 78, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(217, 119, 6);
  doc.text('• Tratamiento de Mejoras y Remodelaciones:', margin + 3, y + 11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text('Las remodelaciones con facturas electrónicas/documentos soporte incrementan el costo fiscal y reducen el 15% de Ganancia Ocasional.', margin + 63, y + 11);

  y += 21;

  // --- INVENTORY OF DOCUMENTS (INVENTARIO DEL HÉROE) ---
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('INVENTARIO DE DOCUMENTOS Y SOPORTES RECOMENDADOS:', margin, y);
  y += 4;

  const userDocs = HERO_DOCUMENTS.filter(d => userData.collectedDocuments.includes(d.id));
  const docsToDisplay = userDocs.length > 0 ? userDocs : HERO_DOCUMENTS.slice(0, 6);

  docsToDisplay.forEach((d) => {
    const isCollected = userData.collectedDocuments.includes(d.id);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(isCollected ? 15 : 100, isCollected ? 118 : 116, isCollected ? 110 : 139);
    const mark = isCollected ? '[OK]' : '[PENDIENTE]';
    doc.text(`${mark} ${d.title}`, margin + 3, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(7);
    doc.text(`- ${d.description}`, margin + 6, y + 7.5);
    y += 9;
  });

  // --- FOOTER & CONTACT CTA ---
  const footerY = pageHeight - 24;
  doc.setFillColor(15, 23, 42);
  doc.rect(0, footerY, pageWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('¿Necesitas elaborar o presentar tu Declaración de Renta sin errores?', margin, footerY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text('Contáctanos de inmediato para una asesoría tributaria profesional y personalizada:', margin, footerY + 13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(251, 191, 36);
  doc.text(`WhatsApp: ${TAX_CONSTANTS.WHATSAPP_DISPLAY}   |   Correo: ${TAX_CONSTANTS.EMAIL_CONTACT}`, margin, footerY + 19);

  // Save the PDF
  const filename = `Renta_Quest_2026_${userData.playerName ? userData.playerName.replace(/\s+/g, '_') : 'Contribuyente'}.pdf`;
  doc.save(filename);
}
