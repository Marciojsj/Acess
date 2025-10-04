# 🚀 Quick Start - Comandos Rápidos

## Instalação Inicial (Uma vez)

```bash
# 1. Instalar dependências
npm install

# 2. Copiar .env
cp .env.example .env

# 3. Editar .env (abrir no editor e configurar DATABASE_URL)
code .env

# 4. Setup Prisma
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Desenvolvimento (Dia a dia)

```bash
# Iniciar servidor
npm run dev

# Em outro terminal - Prisma Studio (visualizar banco)
npm run prisma:studio
```

## Testes

```bash
# Rodar testes
npm test

# Testes em watch mode
npm run test:watch
```

## Banco de Dados

```bash
# Gerar Prisma Client
npm run prisma:generate

# Criar nova migration
npm run prisma:migrate

# Reset banco (CUIDADO: apaga tudo)
npx prisma migrate reset

# Rodar seed novamente
npm run prisma:seed

# Abrir Prisma Studio
npm run prisma:studio
```

## Build & Deploy

```bash
# Build para produção
npm run build

# Rodar em produção
npm start
```

## Credenciais de Teste (após seed)

```
Super Admin:
  Email: superadmin@demo.com
  Senha: senha12345

Admin Escola:
  Email: admin.escola@demo.com
  Senha: senha12345

Operador:
  Email: operador.escola@demo.com
  Senha: senha12345
```

## URLs

```
API: http://localhost:3000/api
Health: http://localhost:3000/health
Prisma Studio: http://localhost:5555
```

## Testar API

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@demo.com","password":"senha12345"}'
```

### 3. Listar usuários (use o token do login)
```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Troubleshooting Rápido

### Erro: módulos não encontrados
```bash
npm install
```

### Erro: Prisma Client não gerado
```bash
npm run prisma:generate
```

### Erro: Porta 3000 em uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou mude a porta no .env
PORT=3001
```

### Limpar e recomeçar
```bash
# Limpar node_modules
rm -rf node_modules
npm install

# Limpar banco
npx prisma migrate reset
npm run prisma:seed
```

## Git

```bash
# Primeiro commit
git init
git add .
git commit -m "Backend completo - Parte 1"

# Push para GitHub
git remote add origin <seu-repo>
git push -u origin main
```

## Próximo Passo

```bash
# Continuar para Frontend
"Criar PARTE 2 - Frontend Next.js"
```
