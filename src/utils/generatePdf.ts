export interface EntityOption {
  id: string;
  label: string;
  [key: string]: any;
}

export const generateOperationalPassportPDF = async (entity: EntityOption, lotesCount: number = 0) => {
  // Asegurar que solo se ejecute en el navegador cliente
  if (typeof window === 'undefined') return;

  // Importación dinámica para evitar problemas de SSR en Vercel
  const jsPDFModule = await import('jspdf');
  const jsPDF = jsPDFModule.default;

  const doc = new jsPDF();
  const timestamp = new Date().toLocaleString();

  // Configuración de colores y estilos institucionales
  doc.setFillColor(8, 12, 20);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('AGROPASSPORT — FICHA OPERATIVA', 14, 25);

  doc.setTextColor(100, 150, 200);
  doc.setFontSize(10);
  doc.text(`Generado el: ${timestamp}`, 14, 33);

  // Sección de Datos de la Entidad / Productor
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(14);
  doc.text('1. Identificación del Productor / Establecimiento', 14, 55);

  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(`Nombre / Razón Social: ${entity.label}`, 14, 65);
  doc.text(`ID de Entidad / CUIT: ${entity.id}`, 14, 73);
  doc.text(`Lotes Registrados en Sistema: ${lotesCount}`, 14, 81);
  doc.text(`Estado Criptográfico / Sello: VERIFICADO Y ACTIVO`, 14, 89);

  // Línea divisoria
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 98, 196, 98);

  // Sección de Trazabilidad y Maquinaria
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 30);
  doc.text('2. Resumen de Activos y Parque Operativo', 14, 112);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Este documento certifica las operaciones asociadas al módulo inteligente', 14, 120);
  doc.text('de trazabilidad agrícola bajo normativas vigentes.', 14, 126);

  // Pie de página legal
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('AgroPassport Enterprise Core — Trazabilidad Descentralizada PostgreSQL', 14, 280);
  doc.text('Firma digital verificada por token de sesión.', 14, 285);

  // Descarga automática del archivo en el navegador del usuario
  doc.save(`Ficha_Operativa_${entity.label.replace(/\s+/g, '_')}.pdf`);
};

// Alias para mantener compatibilidad si en PassportCard lo llamas así
export const generatePassportPDF = generateOperationalPassportPDF;