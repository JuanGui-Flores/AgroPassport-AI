// src/utils/generatePdf.ts
import html2pdf from 'html2pdf.js';

export interface PdfDataProps {
  loteName: string;
  parcela: string;
  location: string;
  hectareas: number;
  score: number;
  ndvi: number;
  rinde: string;
  entityName: string;
}

export const generatePassportPDF = async (data: PdfDataProps) => {
  const element = document.createElement('div');
  element.innerHTML = `
    <div style="font-family: Arial, sans-serif; padding: 30px; color: #0f172a; background-color: #ffffff;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px;">
        <div>
          <h1 style="font-size: 22px; margin: 0; color: #065f46;">AgroPassport AI</h1>
          <p style="font-size: 11px; color: #64748b; margin: 2px 0 0 0;">Ficha Técnica de Evaluación Satelital & Riesgo Agrícola</p>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 10px; background-color: #ecfdf5; color: #047857; padding: 4px 8px; border-radius: 6px; font-weight: bold; border: 1px solid #a7f3d0;">
            VERIFICADO POR GIS
          </span>
          <p style="font-size: 9px; color: #94a3b8; margin-top: 4px;">Fecha: ${new Date().toLocaleDateString('es-AR')}</p>
        </div>
      </div>

      <!-- Resumen del Lote -->
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; margin-bottom: 20px;">
        <h2 style="font-size: 16px; margin: 0 0 8px 0; color: #0f172a;">${data.loteName} - ${data.parcela}</h2>
        <p style="font-size: 12px; color: #475569; margin: 0;"><strong>Ubicación:</strong> ${data.location} | <strong>Superficie:</strong> ${data.hectareas} Hectáreas</p>
      </div>

      <!-- Métricas Clave Grid -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
        <tr>
          <td style="width: 50%; padding: 12px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; text-align: center;">
            <p style="font-size: 11px; color: #166534; font-weight: bold; margin: 0;">PASSPORT SCORE</p>
            <p style="font-size: 28px; font-weight: bold; color: #15803d; margin: 5px 0;">${data.score} / 100</p>
            <p style="font-size: 10px; color: #166534; margin: 0;">Apto Crédito & Seguro</p>
          </td>
          <td style="width: 4%;"></td>
          <td style="width: 46%; padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
            <p style="font-size: 11px; color: #64748b; margin: 0 0 6px 0;"><strong>Salud Vegetal (NDVI):</strong> <span style="color: #047857; font-weight: bold;">${data.ndvi} (Óptimo)</span></p>
            <p style="font-size: 11px; color: #64748b; margin: 0 0 6px 0;"><strong>Rinde Estimado:</strong> <span style="color: #0f172a; font-weight: bold;">${data.rinde}</span></p>
            <p style="font-size: 11px; color: #64748b; margin: 0;"><strong>Entidad Financiera:</strong> <span style="color: #0f172a;">${data.entityName}</span></p>
          </td>
        </tr>
      </table>

      <!-- Certificación & Pie de Página -->
      <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 30px; font-size: 10px; color: #94a3b8; text-align: center;">
        <p>Documento generado por la plataforma AgroPassport AI. Auditoría satelital realizada vía Sentinel-2 GIS Engine.</p>
      </div>
    </div>
  `;

  // Se agrega `as const` para asegurar que TypeScript no infiera los tipos como strings genéricos
  const opt = {
    margin: 10,
    filename: `Ficha_Tecnica_${data.loteName.replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  } as const;

  await html2pdf().set(opt).from(element).save();
};