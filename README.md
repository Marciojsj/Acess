# Sistema de Controle de Acesso - Backend

API REST completa para gerenciamento de controle de acesso com autenticação JWT, níveis de permissão e QR Code para visitantes.

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Express** - Framework web
- **Prisma** - ORM para PostgreSQL
- **JWT** - Autenticação e autorização
- **bcrypt** - Hash de senhas
- **QRCode** - Geração de QR codes
- **Nodemailer** - Envio de emails

## 📋 Funcionalidades

### Autenticação
- ✅ Login/Logout
- ✅ Registro de usuários
- ✅ JWT com Access Token + Refresh Token
- ✅ Refresh token endpoint

### Usuários
- ✅ CRUD completo
- ✅ 5 níveis de permissão: SUPERADMIN, ADMIN, OPERATOR, USER, VISITOR
- ✅ Validação de email único
- ✅ Hash de senhas

### Entidades
- ✅ CRUD completo
- ✅ Tipos: SCHOOL, CONDOMINIUM, COMPANY, EVENT
- ✅ Gestão de usuários por entidade

### Controle de Acesso
- ✅ Registro de entradas/saídas
- ✅ QR Code temporário para visitantes
- ✅ Validação de QR Code
- ✅ Estatísticas de acesso
- ✅ Histórico completo

## 🗂️ Estrutura de Pastas

```
src/
├── controllers/        # Controladores das rotas
│   ├── AuthController.ts
│   ├── UserController.ts
│   ├── EntityController.ts
│   └── AccessController.ts
├── services/          # Lógica de negócio
│   ├── AuthService.ts
│   ├── UserService.ts
│   ├── EntityService.ts
│   └── AccessService.ts
├── routes/            # Definição de rotas
│   ├── auth.ts
│   ├── users.ts
│   ├── entities.ts
│   └── access.ts
├── middlewares/       # Middlewares
│   ├── auth.ts
│   ├── permissions.ts
│   └── errorHandler.ts
├── utils/             # Utilitários
│   ├── email.ts
│   ├── qrcode.ts
│   ├── validators.ts
│   └── prisma.ts
├── app.ts             # Configuração Express
└── server.ts          # Servidor HTTP
```

## 🛠️ Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o `.env` com suas configurações:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/access_control"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### 3. Configurar banco de dados

```bash
# Gerar Prisma Client
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# (Opcional) Abrir Prisma Studio
npm run prisma:studio
```

### 4. Rodar o servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 📚 Endpoints da API

### Autenticação

```
POST   /api/auth/login       - Login
POST   /api/auth/register    - Registro
POST   /api/auth/refresh     - Renovar access token
POST   /api/auth/logout      - Logout
```

### Usuários

```
GET    /api/users            - Listar usuários (ADMIN, SUPERADMIN)
GET    /api/users/:id        - Buscar usuário (ADMIN, SUPERADMIN)
POST   /api/users            - Criar usuário (ADMIN, SUPERADMIN)
PUT    /api/users/:id        - Atualizar usuário (ADMIN, SUPERADMIN)
DELETE /api/users/:id        - Deletar usuário (SUPERADMIN)
```

### Entidades

```
GET    /api/entities         - Listar entidades (ADMIN, SUPERADMIN)
GET    /api/entities/:id     - Buscar entidade (ADMIN, SUPERADMIN)
POST   /api/entities         - Criar entidade (SUPERADMIN)
PUT    /api/entities/:id     - Atualizar entidade (SUPERADMIN)
DELETE /api/entities/:id     - Deletar entidade (SUPERADMIN)
```

### Controle de Acesso

```
GET    /api/access           - Listar registros (Todos autenticados)
GET    /api/access/stats     - Estatísticas (Todos autenticados)
GET    /api/access/:id       - Buscar registro (Todos autenticados)
POST   /api/access           - Criar registro (OPERATOR, ADMIN, SUPERADMIN)

POST   /api/access/qrcode/generate      - Gerar QR Code visitante (ADMIN, SUPERADMIN)
GET    /api/access/qrcode/validate/:code - Validar QR Code (OPERATOR, ADMIN, SUPERADMIN)
POST   /api/access/qrcode/use/:code     - Usar QR Code (OPERATOR, ADMIN, SUPERADMIN)
```

## 🔐 Níveis de Permissão

1. **SUPERADMIN** - Acesso total ao sistema
2. **ADMIN** - Gerencia sua entidade (escola, condomínio, etc)
3. **OPERATOR** - Registra entradas/saídas
4. **USER** - Acesso básico
5. **VISITOR** - Acesso temporário via QR Code

## 🧪 Testes

```bash
npm test
npm run test:watch
```

## 📦 Build

```bash
npm run build
```

Os arquivos compilados estarão em `dist/`

## 🔄 Scripts Úteis

```bash
npm run dev              # Servidor em modo desenvolvimento
npm run build            # Build para produção
npm start                # Iniciar servidor (produção)
npm run prisma:generate  # Gerar Prisma Client
npm run prisma:migrate   # Executar migrations
npm run prisma:studio    # Abrir Prisma Studio
npm test                 # Rodar testes
```

## 🌐 Health Check

```bash
GET http://localhost:3000/health
```

Resposta:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📝 Exemplo de Uso

### 1. Registrar usuário

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "senha123456",
  "role": "ADMIN"
}
```

### 2. Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "senha123456"
}
```

Resposta:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

### 3. Criar registro de acesso

```bash
POST /api/access
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "userId": "user-uuid",
  "type": "ENTRY",
  "status": "AUTHORIZED",
  "method": "CARD"
}
```

### 4. Gerar QR Code para visitante

```bash
POST /api/access/qrcode/generate
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "visitorName": "João Silva",
  "visitorDoc": "123456789",
  "visitorPhone": "+5511999999999",
  "validHours": 24
}
```

## 🐛 Debug

Para ver os logs do Prisma:

```bash
DEBUG=prisma:* npm run dev
```

## � Documentação Completa

| Documento | Descrição |
|-----------|-----------|
| **[INDEX.md](INDEX.md)** | 📚 Índice completo de toda documentação |
| **[RESUMO.md](RESUMO.md)** | ⚡ Resumo executivo do projeto |
| **[INSTALL.md](INSTALL.md)** | 🚀 Guia de instalação detalhado |
| **[SETUP.md](SETUP.md)** | 🛠️ Setup completo passo a passo |
| **[QUICKSTART.md](QUICKSTART.md)** | ⚡ Comandos rápidos |
| **[API.md](API.md)** | 📡 Documentação completa da API |
| **[API-QUICK-REFERENCE.md](API-QUICK-REFERENCE.md)** | 📋 Referência visual rápida |
| **[REQUESTS.md](REQUESTS.md)** | 🧪 Exemplos de requests HTTP |
| **[ESTRUTURA.md](ESTRUTURA.md)** | 🏗️ Arquitetura do projeto |
| **[ROADMAP.md](ROADMAP.md)** | 🗺️ Próximas partes e planejamento |
| **[PARTE-1-COMPLETA.md](PARTE-1-COMPLETA.md)** | ✅ Status da Parte 1 |
| **[prisma/README.md](prisma/README.md)** | 🗄️ Documentação do Prisma |

**🎯 Comece por:** [INDEX.md](INDEX.md) ou [QUICKSTART.md](QUICKSTART.md)

## �📄 Licença

MIT
"# Acess" 
