import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get('entityId');

    const machinery = await prisma.maquinaria.findMany({
      where: entityId ? { entityId } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(machinery);
  } catch (error) {
    console.error('Error al obtener maquinaria desde la base de datos:', error);
    return NextResponse.json(
      { error: 'Error al consultar la maquinaria en la base de datos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newMachine = await prisma.machinery.create({
      data: {
        code: body.code,
        nombre: body.nombre || body.name,
        tipo: body.tipo || body.type,
        estado: body.estado || 'Operativo',
        horasUso: Number(body.horasUso) || 0,
        combustiblePct: Number(body.combustiblePct) || 100,
        alertasCount: Number(body.alertasCount) || 0,
        entityId: body.entityId,
        loteAsignadoId: body.loteId || body.loteAsignadoId || null,
      },
    });

    return NextResponse.json(newMachine, { status: 201 });
  } catch (error) {
    console.error('Error al registrar máquina en la base de datos:', error);
    return NextResponse.json(
      { error: 'Error al registrar la máquina' },
      { status: 500 }
    );
  }
}