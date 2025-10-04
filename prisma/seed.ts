import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Criar entidades de exemplo
  console.log('📦 Criando entidades...');
  
  const school = await prisma.entity.upsert({
    where: { id: 'school-1' },
    update: {},
    create: {
      id: 'school-1',
      name: 'Escola Exemplo',
      type: 'SCHOOL',
      address: 'Rua das Flores, 123',
      phone: '+5511999999999',
      email: 'contato@escola.com',
    },
  });

  const condominium = await prisma.entity.upsert({
    where: { id: 'condo-1' },
    update: {},
    create: {
      id: 'condo-1',
      name: 'Condomínio Residencial',
      type: 'CONDOMINIUM',
      address: 'Av. Principal, 456',
      phone: '+5511988888888',
      email: 'contato@condominio.com',
    },
  });

  const company = await prisma.entity.upsert({
    where: { id: 'company-1' },
    update: {},
    create: {
      id: 'company-1',
      name: 'Empresa Tech LTDA',
      type: 'COMPANY',
      address: 'Rua Comercial, 789',
      phone: '+5511977777777',
      email: 'contato@empresa.com',
    },
  });

  console.log('✅ Entidades criadas');

  // Criar usuários
  console.log('👥 Criando usuários...');

  const hashedPassword = await bcrypt.hash('senha12345', 10);

  // Super Admin
  await prisma.user.upsert({
    where: { email: 'superadmin@demo.com' },
    update: {},
    create: {
      name: 'Super Administrador',
      email: 'superadmin@demo.com',
      password: hashedPassword,
      role: 'SUPERADMIN',
      phone: '+5511966666666',
      document: '00000000000',
    },
  });

  // Admin da Escola
  await prisma.user.upsert({
    where: { email: 'admin.escola@demo.com' },
    update: {},
    create: {
      name: 'Admin Escola',
      email: 'admin.escola@demo.com',
      password: hashedPassword,
      role: 'ADMIN',
      entityId: school.id,
      phone: '+5511955555555',
      document: '11111111111',
    },
  });

  // Operador da Escola
  await prisma.user.upsert({
    where: { email: 'operador.escola@demo.com' },
    update: {},
    create: {
      name: 'Operador Portaria',
      email: 'operador.escola@demo.com',
      password: hashedPassword,
      role: 'OPERATOR',
      entityId: school.id,
      phone: '+5511944444444',
      document: '22222222222',
    },
  });

  // Admin do Condomínio
  await prisma.user.upsert({
    where: { email: 'admin.condo@demo.com' },
    update: {},
    create: {
      name: 'Admin Condomínio',
      email: 'admin.condo@demo.com',
      password: hashedPassword,
      role: 'ADMIN',
      entityId: condominium.id,
      phone: '+5511933333333',
      document: '33333333333',
    },
  });

  // Usuário comum da Empresa
  await prisma.user.upsert({
    where: { email: 'usuario.empresa@demo.com' },
    update: {},
    create: {
      name: 'Usuário Empresa',
      email: 'usuario.empresa@demo.com',
      password: hashedPassword,
      role: 'USER',
      entityId: company.id,
      phone: '+5511922222222',
      document: '44444444444',
    },
  });

  console.log('✅ Usuários criados');

  // Criar alguns registros de acesso de exemplo
  console.log('📝 Criando registros de acesso...');

  const operator = await prisma.user.findUnique({
    where: { email: 'operador.escola@demo.com' },
  });

  const user = await prisma.user.findUnique({
    where: { email: 'usuario.empresa@demo.com' },
  });

  if (operator && user) {
    await prisma.accessLog.create({
      data: {
        userId: user.id,
        entityId: company.id,
        type: 'ENTRY',
        status: 'AUTHORIZED',
        method: 'CARD',
        operatorId: operator.id,
      },
    });

    await prisma.accessLog.create({
      data: {
        visitorName: 'João Silva',
        visitorDoc: '55555555555',
        visitorPhone: '+5511911111111',
        entityId: school.id,
        type: 'ENTRY',
        status: 'AUTHORIZED',
        method: 'QR_CODE',
        operatorId: operator.id,
      },
    });
  }

  console.log('✅ Registros de acesso criados');

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📋 Credenciais de acesso:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Super Admin:');
  console.log('  Email: superadmin@demo.com');
  console.log('  Senha: senha12345');
  console.log('\nAdmin Escola:');
  console.log('  Email: admin.escola@demo.com');
  console.log('  Senha: senha12345');
  console.log('\nOperador:');
  console.log('  Email: operador.escola@demo.com');
  console.log('  Senha: senha12345');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
