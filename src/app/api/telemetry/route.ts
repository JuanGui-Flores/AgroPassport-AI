// src/app/api/telemetry/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { loteId, humedadSuelo, temperaturaFoliar, bateriaNodo } = body;

    if (!loteId) {
      return NextResponse.json(
        { error: "loteId es requerido" },
        { status: 400 },
      );
    }

    const telemetry = await prisma.telemetry.create({
      data: {
        loteId,
        humedadSuelo: Number.parseFloat(humedadSuelo),
        temperaturaFoliar: Number.parseFloat(temperaturaFoliar),
        bateriaNodo: Number.parseFloat(bateriaNodo),
      },
    });

    return NextResponse.json(telemetry, { status: 201 });
  } catch (error) {
    console.error("Error al registrar telemetría:", error);
    return NextResponse.json(
      { error: "Error al registrar la telemetría en PostgreSQL" },
      { status: 400 },
    );
  }
}
