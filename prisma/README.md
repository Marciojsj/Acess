# Prisma - Database Schema & Migrations

Esta pasta contém os arquivos relacionados ao Prisma ORM.

## 📁 Arquivos

- **`schema.prisma`** - Schema do banco de dados (modelos, relações, enums)
- **`seed.ts`** - Script para popular o banco com dados iniciais
- **`migrations/`** - Histórico de migrações (gerado automaticamente)

## 🗃️ Modelos do Banco

### User
Usuários do sistema com diferentes níveis de acesso.

**Campos principais:**
- `id`, `name`, `email`, `password`
- `role` - SUPERADMIN | ADMIN | OPERATOR | USER | VISITOR
- `entityId` - Relação com entidade
- `isActive` - Status do usuário

### Entity
Entidades que usam o sistema (escolas, condomínios, empresas).

**Campos principais:**
- `id`, `name`, `type`
- `type` - SCHOOL | CONDOMINIUM | COMPANY | EVENT
- `maxUsers` - Limite de usuários
- `isActive` - Status da entidade

### AccessLog
Registros de entrada e saída.

**Campos principais:**
- `id`, `userId`, `entityId`
- `type` - ENTRY | EXIT
- `status` - AUTHORIZED | DENIED | PENDING
- `method` - MANUAL | QR_CODE | CARD | BIOMETRIC
- `visitorName` - Para visitantes
- `operatorId` - Quem registrou

### RefreshToken
Tokens de refresh para autenticação.

**Campos principais:**
- `id`, `token`, `userId`
- `expiresAt` - Data de expiração

### VisitorQRCode
QR Codes temporários para visitantes.

**Campos principais:**
- `id`, `code`, `visitorName`
- `validUntil` - Validade
- `used` - Se já foi usado

## 🔧 Comandos Úteis

### Gerar Prisma Client
Gera os tipos TypeScript a partir do schema.
```bash
npx prisma generate
# ou
npm run prisma:generate
```

### Criar Migration
Cria uma nova migration a partir das mudanças no schema.
```bash
npx prisma migrate dev --name nome_da_migration
# ou
npm run prisma:migrate
```

### Aplicar Migrations (Produção)
Aplica migrations em produção.
```bash
npx prisma migrate deploy
```

### Reset Database
⚠️ **CUIDADO**: Apaga tudo e recria o banco.
```bash
npx prisma migrate reset
```

### Seed Database
Popular banco com dados iniciais.
```bash
npx prisma db seed
# ou
npm run prisma:seed
```

### Prisma Studio
Interface visual para explorar o banco.
```bash
npx prisma studio
# ou
npm run prisma:studio
```
Abre em: http://localhost:5555

### Validar Schema
Verifica se o schema está correto.
```bash
npx prisma validate
```

### Formatar Schema
Formata o arquivo schema.prisma.
```bash
npx prisma format
```

## 📝 Modificando o Schema

### 1. Editar `schema.prisma`

Adicione ou modifique modelos:

```prisma
model NewModel {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  
  @@map("new_models")
}
```

### 2. Criar Migration

```bash
npx prisma migrate dev --name add_new_model
```

### 3. Verificar

O Prisma vai:
- Criar SQL para as mudanças
- Aplicar no banco
- Regenerar o client TypeScript

## 🔍 Tipos de Dados

```prisma
String      # Texto
Int         # Número inteiro
Float       # Número decimal
Boolean     # true/false
DateTime    # Data e hora
Json        # JSON
Bytes       # Dados binários

# Opcional (pode ser null)
String?

# Array
String[]
```

## 🔗 Relações

```prisma
# Um para Muitos (1:N)
model User {
  id       String   @id
  entityId String?
  entity   Entity?  @relation(fields: [entityId], references: [id])
}

model Entity {
  id    String @id
  users User[]
}

# Muitos para Muitos (M:N)
model Post {
  id         String     @id
  categories Category[]
}

model Category {
  id    String @id
  posts Post[]
}
```

## ⚡ Enums

```prisma
enum Role {
  SUPERADMIN
  ADMIN
  OPERATOR
  USER
  VISITOR
}

# Uso
model User {
  role Role @default(USER)
}
```

## 🎯 Índices

```prisma
model User {
  email String @unique
  
  @@index([email])
  @@index([createdAt])
}
```

## 📚 Documentação

- [Prisma Docs](https://www.prisma.io/docs)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

## 🐛 Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
npm run prisma:generate
```

### "Database does not exist"
```bash
# Criar banco manualmente
psql -U postgres
CREATE DATABASE access_control;
\q

# Ou usar migrate reset
npx prisma migrate reset
```

### Mudanças no schema não refletem
```bash
npm run prisma:generate
```

### Erro de migration
```bash
# Ver status
npx prisma migrate status

# Resolver manualmente
npx prisma migrate resolve --applied "migration_name"
```
