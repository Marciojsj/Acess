# 🚀 Instalação Automática - Script Completo

## ⚡ Método 1: Instalação Automática (Windows)

Copie e cole este script no PowerShell (como Administrador):

```powershell
# Navegar para a pasta do projeto
cd C:\Users\marci\Documents\AccessControl2

# Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Green
npm install

# Verificar se .env existe, se não, copiar do exemplo
if (-not (Test-Path .env)) {
    Write-Host "📝 Criando arquivo .env..." -ForegroundColor Green
    Copy-Item .env.example .env
    Write-Host "⚠️ IMPORTANTE: Edite o arquivo .env com suas configurações!" -ForegroundColor Yellow
    Write-Host "   DATABASE_URL, JWT_SECRET, etc." -ForegroundColor Yellow
} else {
    Write-Host "✅ Arquivo .env já existe" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Instalação concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Edite o arquivo .env com suas configurações" -ForegroundColor White
Write-Host "2. Execute: npm run prisma:generate" -ForegroundColor White
Write-Host "3. Execute: npm run prisma:migrate" -ForegroundColor White
Write-Host "4. Execute: npm run prisma:seed" -ForegroundColor White
Write-Host "5. Execute: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentação: README.md" -ForegroundColor Cyan
```

---

## ⚡ Método 2: Passo a Passo Manual

### 1. Instalar Dependências

```bash
npm install
```

**O que será instalado:**
- express, cors, helmet (servidor)
- @prisma/client, prisma (banco de dados)
- bcrypt, jsonwebtoken (autenticação)
- qrcode, nodemailer (funcionalidades)
- typescript, ts-node-dev (desenvolvimento)
- jest, supertest (testes)

### 2. Configurar Ambiente

```bash
# Copiar .env de exemplo
cp .env.example .env

# Ou no Windows PowerShell:
Copy-Item .env.example .env
```

**Edite o `.env`:**
```env
DATABASE_URL="postgresql://postgres:sua-senha@localhost:5432/access_control"
JWT_SECRET="sua-chave-secreta-aqui-min-32-caracteres"
JWT_REFRESH_SECRET="outra-chave-secreta-diferente-aqui"
```

### 3. Setup do Prisma

```bash
# Gerar Prisma Client
npm run prisma:generate

# Criar banco e rodar migrations
npm run prisma:migrate

# Popular com dados iniciais
npm run prisma:seed
```

### 4. Iniciar Servidor

```bash
npm run dev
```

Servidor rodando em: http://localhost:3000

### 5. Verificar

```bash
# Testar health check
curl http://localhost:3000/health

# Ou abrir no navegador:
# http://localhost:3000/health
```

---

## 🔧 Pré-requisitos

### Necessário Instalar

1. **Node.js 18+**
   - Download: https://nodejs.org/
   - Verificar: `node --version`

2. **PostgreSQL 14+**
   - Download: https://www.postgresql.org/download/
   - Verificar: `psql --version`

3. **Git** (opcional)
   - Download: https://git-scm.com/
   - Verificar: `git --version`

### Configurar PostgreSQL

```sql
-- Abrir psql
psql -U postgres

-- Criar banco de dados
CREATE DATABASE access_control;

-- Verificar
\l

-- Sair
\q
```

---

## 📦 Dependências Principais

### Produção
```json
{
  "@prisma/client": "^5.7.0",
  "bcrypt": "^5.1.1",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "express-async-errors": "^3.1.1",
  "helmet": "^7.1.0",
  "jsonwebtoken": "^9.0.2",
  "nodemailer": "^6.9.7",
  "qrcode": "^1.5.3",
  "zod": "^3.22.4"
}
```

### Desenvolvimento
```json
{
  "@types/bcrypt": "^5.0.2",
  "@types/cors": "^2.8.17",
  "@types/express": "^4.17.21",
  "@types/jest": "^29.5.11",
  "@types/jsonwebtoken": "^9.0.5",
  "@types/node": "^20.10.6",
  "@types/nodemailer": "^6.4.14",
  "@types/qrcode": "^1.5.5",
  "@types/supertest": "^6.0.2",
  "jest": "^29.7.0",
  "prisma": "^5.7.0",
  "supertest": "^6.3.3",
  "ts-jest": "^29.1.1",
  "ts-node-dev": "^2.0.0",
  "typescript": "^5.3.3"
}
```

---

## 🐛 Troubleshooting

### Erro: "npm não é reconhecido"

**Solução:** Instale o Node.js
```bash
# Baixar e instalar: https://nodejs.org/
# Reiniciar o terminal após instalar
```

### Erro: "Cannot find module '@prisma/client'"

**Solução:**
```bash
npm run prisma:generate
```

### Erro: "Database access_control does not exist"

**Solução:**
```sql
psql -U postgres
CREATE DATABASE access_control;
\q
```

### Erro: "Port 3000 already in use"

**Solução (Windows):**
```powershell
# Encontrar processo na porta 3000
netstat -ano | findstr :3000

# Matar processo (substituir PID)
taskkill /PID 1234 /F
```

**Solução (Linux/Mac):**
```bash
# Encontrar e matar processo
lsof -ti:3000 | xargs kill -9
```

### Erro: "connect ECONNREFUSED"

**Solução:** PostgreSQL não está rodando
```bash
# Windows: Iniciar serviço PostgreSQL
# Services.msc → PostgreSQL → Start

# Linux
sudo systemctl start postgresql

# Mac
brew services start postgresql
```

### Erro de permissão no npm install

**Solução (Windows):**
```powershell
# Executar PowerShell como Administrador
```

**Solução (Linux/Mac):**
```bash
# Não use sudo com npm!
# Corrija permissões:
sudo chown -R $USER ~/.npm
```

---

## ✅ Verificação Pós-Instalação

Execute estes comandos para verificar:

```bash
# 1. Node.js instalado
node --version
# Esperado: v18.x.x ou superior

# 2. npm instalado
npm --version
# Esperado: 9.x.x ou superior

# 3. PostgreSQL instalado
psql --version
# Esperado: psql (PostgreSQL) 14.x ou superior

# 4. Dependências instaladas
npm list --depth=0
# Deve listar todas as dependências

# 5. Prisma Client gerado
ls node_modules/.prisma/client
# Deve existir

# 6. Banco de dados criado
psql -U postgres -d access_control -c "SELECT version();"
# Deve retornar versão do PostgreSQL

# 7. Servidor rodando
curl http://localhost:3000/health
# Deve retornar: {"status":"ok","timestamp":"..."}
```

---

## 🎯 Script de Verificação Completo

Salve como `check-setup.ps1` e execute:

```powershell
Write-Host "🔍 Verificando instalação..." -ForegroundColor Cyan
Write-Host ""

# Node.js
Write-Host "1. Node.js:" -NoNewline
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host " ✅ $nodeVersion" -ForegroundColor Green
} else {
    Write-Host " ❌ Não instalado" -ForegroundColor Red
}

# npm
Write-Host "2. npm:" -NoNewline
$npmVersion = npm --version 2>$null
if ($npmVersion) {
    Write-Host " ✅ v$npmVersion" -ForegroundColor Green
} else {
    Write-Host " ❌ Não instalado" -ForegroundColor Red
}

# PostgreSQL
Write-Host "3. PostgreSQL:" -NoNewline
$pgVersion = psql --version 2>$null
if ($pgVersion) {
    Write-Host " ✅ $pgVersion" -ForegroundColor Green
} else {
    Write-Host " ❌ Não instalado" -ForegroundColor Red
}

# node_modules
Write-Host "4. Dependências:" -NoNewline
if (Test-Path "node_modules") {
    Write-Host " ✅ Instaladas" -ForegroundColor Green
} else {
    Write-Host " ❌ Execute 'npm install'" -ForegroundColor Red
}

# .env
Write-Host "5. Arquivo .env:" -NoNewline
if (Test-Path ".env") {
    Write-Host " ✅ Existe" -ForegroundColor Green
} else {
    Write-Host " ❌ Execute 'cp .env.example .env'" -ForegroundColor Red
}

# Prisma Client
Write-Host "6. Prisma Client:" -NoNewline
if (Test-Path "node_modules\.prisma\client") {
    Write-Host " ✅ Gerado" -ForegroundColor Green
} else {
    Write-Host " ❌ Execute 'npm run prisma:generate'" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Verificação concluída!" -ForegroundColor Green
```

---

## 📚 Próximos Passos

Após instalação bem-sucedida:

1. **Ler documentação**
   - [README.md](README.md)
   - [QUICKSTART.md](QUICKSTART.md)

2. **Testar API**
   - [REQUESTS.md](REQUESTS.md)
   - [API-QUICK-REFERENCE.md](API-QUICK-REFERENCE.md)

3. **Explorar código**
   - [ESTRUTURA.md](ESTRUTURA.md)
   - Ver `src/` folder

4. **Próximas partes**
   - [ROADMAP.md](ROADMAP.md)
   - Frontend, Design, Deploy

---

## 💡 Dicas

### Desenvolvimento
```bash
# Servidor com hot reload
npm run dev

# Prisma Studio (visualizar banco)
npm run prisma:studio

# Logs detalhados
DEBUG=* npm run dev
```

### Produção
```bash
# Build
npm run build

# Iniciar
npm start
```

### Testes
```bash
# Rodar testes
npm test

# Watch mode
npm run test:watch
```

---

**🎉 Instalação completa! Backend pronto para usar!**

Ver: [QUICKSTART.md](QUICKSTART.md) para comandos essenciais
