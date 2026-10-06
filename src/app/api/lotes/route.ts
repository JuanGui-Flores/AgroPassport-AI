// src/app/api/lotes/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Obtener todos los lotes con sus telemetrías e información de entidad asociada
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get("entityId");

    const lotes = await prisma.lote.findMany({
      where: entityId ? { entityId } : undefined,
      include: {
        telemetrias: {
          orderBy: { timestamp: "desc" },
          take: 10,
        },
        entity: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(lotes);
  } catch (error) {
    console.error("Error al consultar lotes:", error);
    return NextResponse.json(
      { error: "Error al consultar lotes en PostgreSQL" },
      { status: 500 },
    );
  }
}

// POST: Registrar un nuevo Lote en PostgreSQL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      code,
      nombre,
      hectareas,
      cultivo,
      score,
      ndvi,
      rindeEst,
      latitud,
      longitud,
      entityId,
    } = body;

    if (!code || !nombre || !hectareas || !entityId) {
      return NextResponse.json(
        { error: "code, nombre, hectareas y entityId son obligatorios" },
        { status: 400 },
      );
    }

    const newLote = await prisma.lote.create({
      data: {
        code,
        nombre,
        hectareas: Number.parseFloat(hectareas),
        cultivo: cultivo || "Soja 1ra",
        score: Number.parseFloat(score) || 85.0,
        ndvi: Number.parseFloat(ndvi) || 0.7,
        rindeEst: Number.parseFloat(rindeEst) || 4.0,
        latitud: latitud ? Number.parseFloat(latitud) : null,
        longitud: longitud ? Number.parseFloat(longitud) : null,
        entityId,
      },
      include: {
        telemetrias: true,
        entity: true,
      },
    });

    return NextResponse.json(newLote, { status: 201 });
  } catch (error) {
    console.error("Error al crear lote:", error);
    return NextResponse.json(
      { error: "Error al registrar el lote en PostgreSQL" },
      { status: 400 },
    );
  }
}
