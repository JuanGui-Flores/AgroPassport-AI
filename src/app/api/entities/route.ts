// src/app/api/entities/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const entities = await prisma.entity.findMany({
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        businessName: "asc",
      },
    });

    return NextResponse.json(entities);
  } catch (error) {
    console.error("Error al obtener entidades:", error);
    return NextResponse.json(
      { error: "Error al consultar las entidades en la base de datos" },
      { status: 500 },
    );
  }
}
