# Guia de Setup - Backend

## Pré-requisitos

- Node.js 18+ 
- PostgreSQL 14+
- npm ou yarn

## Passos de Instalação

### 1. Clonar o repositório

```bash
git clone <repository-url>
cd AccessControl2
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar PostgreSQL

Certifique-se de que o PostgreSQL está rodando e crie um banco de dados:

```sql
CREATE DATABASE access_control;
```

### 4. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/access_control?schema=public"
JWT_SECRET="change-this-to-a-random-secret-key-min-32-chars"
JWT_REFRESH_SECRET="change-this-to-another-random-secret-key"
PORT=3000
```

### 5. Executar migrations do Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 6. (Opcional) Seed inicial

Crie um arquivo `prisma/seed.ts` para dados iniciais:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Criar entidade de exemplo
  const entity = await prisma.entity.create({
    data: {
      name: 'Empresa Demo',
      type: 'COMPANY',
      address: 'Rua Exemplo, 123',
      email: 'contato@demo.com',
    },
  });

  // Criar super admin
  const hashedPassword = await bcrypt.hash('admin123456', 10);
  
  await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@demo.com',
      password: hashedPassword,
      role: 'SUPERADMIN',
      entityId: entity.id,
    },
  });

  console.log('Seed concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Adicione ao `package.json`:

```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

Execute:

```bash
npx prisma db seed
```

### 7. Iniciar servidor

```bash
npm run dev
```

O servidor estará rodando em: `http://localhost:3000`

### 8. Testar API

```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"admin123456"}'
```

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Prisma Studio (UI para banco)
npm run prisma:studio

# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Reset banco de dados
npx prisma migrate reset

# Formatar código
npx prettier --write "src/**/*.ts"
```

## Troubleshooting

### Erro de conexão com PostgreSQL

- Verifique se o PostgreSQL está rodando
- Verifique as credenciais no `.env`
- Teste a conexão: `psql -U postgres -d access_control`

### Erro "Cannot find module '@prisma/client'"

```bash
npm run prisma:generate
```

### Porta 3000 já em uso

Altere a variável `PORT` no `.env` ou mate o processo:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

## Próximos Passos

Depois de configurar o backend, prossiga para:
- **PARTE 2**: Frontend (React/Next.js)
- **PARTE 3**: Design System & UX
- **PARTE 4**: Segurança, CI/CD e Deploy
