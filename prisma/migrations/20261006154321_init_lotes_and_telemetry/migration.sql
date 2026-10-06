-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PRODUCER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PRODUCER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entity" (
    "id" TEXT NOT NULL,
    "cuit" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "code" TEXT,
    "type" TEXT DEFAULT 'partner',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,

    CONSTRAINT "EntityMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lote" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "hectareas" DOUBLE PRECISION NOT NULL,
    "cultivo" TEXT,
    "score" DOUBLE PRECISION NOT NULL,
    "ndvi" DOUBLE PRECISION NOT NULL,
    "rindeEst" DOUBLE PRECISION NOT NULL,
    "latitud" DOUBLE PRECISION,
    "longitud" DOUBLE PRECISION,
    "entityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Telemetry" (
    "id" TEXT NOT NULL,
    "loteId" TEXT NOT NULL,
    "humedadSuelo" DOUBLE PRECISION NOT NULL,
    "temperaturaFoliar" DOUBLE PRECISION NOT NULL,
    "bateriaNodo" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Telemetry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Entity_cuit_key" ON "Entity"("cuit");

-- CreateIndex
CREATE UNIQUE INDEX "EntityMember_userId_entityId_key" ON "EntityMember"("userId", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "Lote_code_key" ON "Lote"("code");

-- AddForeignKey
ALTER TABLE "EntityMember" ADD CONSTRAINT "EntityMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityMember" ADD CONSTRAINT "EntityMember_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lote" ADD CONSTRAINT "Lote_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telemetry" ADD CONSTRAINT "Telemetry_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
