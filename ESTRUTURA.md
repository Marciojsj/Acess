# 📁 Estrutura Completa do Projeto

```
AccessControl2/
│
├── 📂 src/                          # Código fonte
│   ├── 📂 controllers/              # Controllers (camada de apresentação)
│   │   ├── AuthController.ts        # Login, register, refresh, logout
│   │   ├── UserController.ts        # CRUD de usuários
│   │   ├── EntityController.ts      # CRUD de entidades
│   │   └── AccessController.ts      # Controle de acesso, QR codes
│   │
│   ├── 📂 services/                 # Services (lógica de negócio)
│   │   ├── AuthService.ts           # Autenticação e tokens
│   │   ├── UserService.ts           # Gestão de usuários
│   │   ├── EntityService.ts         # Gestão de entidades
│   │   └── AccessService.ts         # Registros de acesso
│   │
│   ├── 📂 routes/                   # Definição de rotas
│   │   ├── auth.ts                  # POST /auth/login, /register, etc
│   │   ├── users.ts                 # GET/POST/PUT/DELETE /users
│   │   ├── entities.ts              # GET/POST/PUT/DELETE /entities
│   │   └── access.ts                # GET/POST /access, QR codes
│   │
│   ├── 📂 middlewares/              # Middlewares
│   │   ├── auth.ts                  # Verifica JWT token
│   │   ├── permissions.ts           # Controla acesso por role
│   │   └── errorHandler.ts          # Handler global de erros
│   │
│   ├── 📂 utils/                    # Utilitários
│   │   ├── email.ts                 # Envio de emails (nodemailer)
│   │   ├── qrcode.ts                # Geração de QR codes
│   │   ├── validators.ts            # Validações (email, senha, etc)
│   │   └── prisma.ts                # Cliente Prisma
│   │
│   ├── 📂 __tests__/                # Testes
│   │   └── api.test.ts              # Testes de integração
│   │
│   ├── 📄 app.ts                    # Configuração Express
│   └── 📄 server.ts                 # Servidor HTTP
│
├── 📂 prisma/                       # Prisma ORM
│   ├── 📄 schema.prisma             # Schema do banco (modelos, enums)
│   └── 📄 seed.ts                   # Dados iniciais
│
├── 📂 dist/                         # Build (gerado)
│   └── ...
│
├── 📄 package.json                  # Dependências e scripts
├── 📄 tsconfig.json                 # Config TypeScript
├── 📄 jest.config.js                # Config Jest (testes)
│
├── 📄 .env                          # Variáveis de ambiente (NÃO commitar)
├── 📄 .env.example                  # Exemplo de .env
├── 📄 .gitignore                    # Arquivos ignorados pelo Git
│
├── 📄 README.md                     # Documentação geral
├── 📄 SETUP.md                      # Guia de instalação
├── 📄 API.md                        # Documentação da API
├── 📄 REQUESTS.md                   # Exemplos de requests
├── 📄 QUICKSTART.md                 # Comandos rápidos
├── 📄 PARTE-1-COMPLETA.md           # Status e próximos passos
└── 📄 ESTRUTURA.md                  # Este arquivo
```

---

## 🗂️ Organização por Camadas

### 1️⃣ **Routes** (Rotas)
- Define os endpoints HTTP
- Aplica middlewares (auth, permissions)
- Delega para controllers

### 2️⃣ **Controllers** (Controladores)
- Recebe requests HTTP
- Valida dados de entrada
- Chama services
- Retorna responses

### 3️⃣ **Services** (Serviços)
- Contém lógica de negócio
- Interage com banco de dados (Prisma)
- Validações complexas
- Reutilizável

### 4️⃣ **Middlewares**
- Autenticação (JWT)
- Autorização (permissions)
- Error handling
- Logs (opcional)

### 5️⃣ **Utils** (Utilitários)
- Funções auxiliares
- Validações simples
- Integrações (email, QR code)

---

## 📊 Modelos do Banco de Dados

```
┌─────────────┐
│    User     │
├─────────────┤
│ id          │
│ name        │
│ email       │◄───┐
│ password    │    │
│ role        │    │
│ entityId    │────┼───┐
│ isActive    │    │   │
│ phone       │    │   │
│ document    │    │   │
│ createdAt   │    │   │
└─────────────┘    │   │
                   │   │
┌─────────────┐    │   │
│   Entity    │    │   │
├─────────────┤    │   │
│ id          │◄───┘   │
│ name        │        │
│ type        │        │
│ address     │        │
│ phone       │        │
│ email       │        │
│ isActive    │        │
│ maxUsers    │        │
└─────────────┘        │
                       │
┌─────────────┐        │
│ AccessLog   │        │
├─────────────┤        │
│ id          │        │
│ userId      │────────┘
│ entityId    │
│ visitorName │
│ visitorDoc  │
│ type        │ (ENTRY/EXIT)
│ status      │ (AUTHORIZED/DENIED)
│ method      │ (CARD/QR_CODE/MANUAL)
│ operatorId  │
│ timestamp   │
└─────────────┘

┌─────────────┐
│RefreshToken │
├─────────────┤
│ id          │
│ token       │
│ userId      │
│ expiresAt   │
└─────────────┘

┌──────────────┐
│VisitorQRCode│
├──────────────┤
│ id           │
│ code         │
│ visitorName  │
│ validUntil   │
│ used         │
│ createdBy    │
└──────────────┘
```

---

## 🔐 Hierarquia de Permissões

```
┌──────────────────────────────────────┐
│         SUPERADMIN (Nível 1)         │  ← Acesso total
│  - Criar/editar entidades            │
│  - Gerenciar todos usuários          │
│  - Ver todos registros               │
└──────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼───────┐   ┌───────▼───────┐
│ ADMIN (Nível 2)    │ ADMIN (Nível 2)
│   Entidade A   │   │   Entidade B   │  ← Gestão da entidade
│ - Criar users  │   │ - Criar users  │
│ - Ver acessos  │   │ - Ver acessos  │
└────────┬───────┘   └────────┬───────┘
         │                    │
    ┌────▼────┐          ┌────▼────┐
    │OPERATOR │          │OPERATOR │  ← Registra acessos
    │(Nível 3)│          │(Nível 3)│
    └────┬────┘          └────┬────┘
         │                    │
    ┌────▼────┐          ┌────▼────┐
    │  USER   │          │  USER   │  ← Acesso básico
    │(Nível 4)│          │(Nível 4)│
    └─────────┘          └─────────┘

┌──────────────┐
│   VISITOR    │  ← Acesso temporário via QR Code
│  (Nível 5)   │
└──────────────┘
```

---

## 🔄 Fluxo de uma Request

```
1. CLIENT
   │
   ├─► POST /api/access
   │   Authorization: Bearer token
   │   { userId: "...", type: "ENTRY" }
   │
2. EXPRESS (app.ts)
   │
   ├─► Middlewares globais
   │   ├─ helmet() (segurança)
   │   ├─ cors()
   │   └─ express.json()
   │
3. ROUTES (routes/access.ts)
   │
   ├─► authenticate middleware
   │   └─ Verifica JWT token
   │
   ├─► permit('OPERATOR', 'ADMIN') middleware
   │   └─ Verifica role do usuário
   │
   ├─► AccessController.create()
   │
4. CONTROLLER (controllers/AccessController.ts)
   │
   ├─► Valida req.body
   ├─► Extrai user do token
   ├─► Chama AccessService.create()
   │
5. SERVICE (services/AccessService.ts)
   │
   ├─► Lógica de negócio
   ├─► Validações
   ├─► Prisma.accessLog.create()
   │
6. PRISMA
   │
   └─► INSERT INTO access_logs ...
   │
7. POSTGRES
   │
   └─► Retorna dados salvos
   │
8. Volta pela stack
   │
   └─► Response: 201 Created { id, ... }
```

---

## 📝 Convenções do Código

### Nomes de Arquivos
- `PascalCase` para classes: `UserService.ts`
- `camelCase` para rotas: `auth.ts`
- `.test.ts` para testes: `api.test.ts`

### Estrutura de Service
```typescript
export class UserService {
  async findAll() { ... }
  async findById(id: string) { ... }
  async create(data: CreateUserData) { ... }
  async update(id: string, data: UpdateUserData) { ... }
  async delete(id: string) { ... }
}
```

### Estrutura de Controller
```typescript
export class UserController {
  async findAll(req: Request, res: Response) {
    const users = await userService.findAll();
    return res.json(users);
  }
}
```

### Error Handling
```typescript
throw new AppError('Mensagem de erro', 400);
```

---

## 🎯 Comandos por Funcionalidade

### Desenvolvimento
```bash
npm run dev              # Inicia servidor
npm run prisma:studio    # UI do banco
```

### Banco de Dados
```bash
npm run prisma:generate  # Gerar client
npm run prisma:migrate   # Rodar migrations
npm run prisma:seed      # Popular dados
```

### Build & Deploy
```bash
npm run build           # Compilar TypeScript
npm start               # Produção
```

### Testes
```bash
npm test                # Rodar testes
npm run test:watch      # Watch mode
```

---

## 🔍 Onde Encontrar o Quê

| Preciso de... | Onde encontrar |
|---------------|----------------|
| Endpoints da API | `API.md` |
| Instalar projeto | `SETUP.md` |
| Comandos rápidos | `QUICKSTART.md` |
| Testar com curl | `REQUESTS.md` |
| Visão geral | `README.md` |
| Próximas partes | `PARTE-1-COMPLETA.md` |
| Estrutura | `ESTRUTURA.md` (este) |

---

**✨ Backend organizado, documentado e pronto para escalar!**
