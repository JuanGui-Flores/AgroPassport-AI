// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Poblando PostgreSQL con Entidades, Lotes y Telemetría...');

  // Limpiar en orden respetando las claves foráneas
  await prisma.telemetry.deleteMany();
  await prisma.lote.deleteMany();
  await prisma.entityMember.deleteMany();
  await prisma.user.deleteMany();
  await prisma.entity.deleteMany();

  // Crear Usuarios
  const admin = await prisma.user.create({
    data: {
      email: 'admin@agropassport.com',
      name: 'Administrador General',
      role: Role.ADMIN,
    },
  });

  const producer = await prisma.user.create({
    data: {
      email: 'productor@agropassport.com',
      name: 'Juan Pérez (Productor)',
      role: Role.PRODUCER,
    },
  });

  // Crear Entidades
  const entity1 = await prisma.entity.create({
    data: {
      cuit: '30-71234567-8',
      businessName: 'Establecimiento Las Marías S.A.',
      code: 'AP-101',
      type: 'partner',
    },
  });

  const entity2 = await prisma.entity.create({
    data: {
      cuit: '30-88765432-1',
      businessName: 'Agropecuaria El Hornero S.R.L.',
      code: 'AP-102',
      type: 'branch',
    },
  });

  // Vincular usuarios
  await prisma.entityMember.create({
    data: {
      userId: producer.id,
      entityId: entity1.id,
    },
  });

  await prisma.entityMember.create({
    data: {
      userId: admin.id,
      entityId: entity2.id,
    },
  });

  // Crear Lote asociado a la Entidad 1
  const lote1 = await prisma.lote.create({
    data: {
      code: 'ARG-SJ-2026',
      nombre: 'Lote Norte - Cuartel 3',
      hectareas: 145.0,
      cultivo: 'Soja 1ra',
      score: 88.5,
      ndvi: 0.74,
      rindeEst: 4.2,
      latitud: -31.5375,
      longitud: -68.5364,
      entityId: entity1.id,
    },
  });

  // Crear registros de Telemetría
  await prisma.telemetry.createMany({
    data: [
      { loteId: lote1.id, humedadSuelo: 32.5, temperaturaFoliar: 22.4, bateriaNodo: 98.0 },
      { loteId: lote1.id, humedadSuelo: 31.0, temperaturaFoliar: 23.1, bateriaNodo: 97.5 },
    ],
  });

  console.log('✅ Base de datos poblada con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });