// src/app/api/agro/query/route.ts (o tu controlador equivalente)

import { NextResponse } from 'next/server';
import { RateLimiter } from '@/services/security/RateLimiter';
import { FinancialQuerySchema } from '@/services/security/securitySchemas';
// Asumiendo que tienes tu AuditLogger o SecurityGateway estructurado
// import { SecurityGateway } from '@/services/security/SecurityGateway';

export async function POST(request: Request) {
  // 1. Obtener la IP del cliente para el Rate Limiting
  const forwardedFor = request.headers.get('x-forwarded-for');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

  // 2. Verificar Rate Limiting
  if (RateLimiter.isRateLimited(clientIp)) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Intente nuevamente en unos minutos.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // 3. Validar los datos de entrada usando los esquemas de Zod
    const validationResult = FinancialQuerySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Datos de entrada inválidos', 
          details: validationResult.error.format() 
        },
        { status: 400 }
      );
    }

    const validData = validationResult.data;

    // 4. Lógica de negocio protegida (conexión con adaptadores Sancor, Galicia o Macro)
    // ... aquí ejecutarías tu servicio financiero con validData ...

    return NextResponse.json({
      success: true,
      message: 'Consulta procesada de forma segura bajo estándares corporativos.',
      data: validData,
    });

  } catch (error) {
    console.error('[Security Gateway Error]', error);
    return NextResponse.json(
      { error: 'Error interno en el servidor de pasarela.' },
      { status: 500 }
    );
  }
}