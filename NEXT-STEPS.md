# ✅ CHECKLIST - Próximos Passos

## Status Atual
- ✅ Dependências instaladas (`npm install`)
- ✅ Prisma Client gerado
- ✅ Arquivo `.env` criado

## 📋 O QUE FALTA FAZER

### 1. Configurar Banco de Dados PostgreSQL

**Escolha uma opção:**

#### Opção A: PostgreSQL Local (Windows)
```powershell
# 1. Baixar e instalar PostgreSQL
# https://www.postgresql.org/download/windows/

# 2. Após instalar, criar banco:
# Abrir pgAdmin ou terminal
psql -U postgres
CREATE DATABASE access_control;
\q

# 3. Atualizar .env:
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/access_control?schema=public"
```

#### Opção B: Supabase Cloud (RECOMENDADO - Grátis) ⭐
```
1. Acesse: https://supabase.com/
2. Criar conta (login com GitHub)
3. New Project → escolher nome e senha
4. Aguardar criação (~2 minutos)
5. Settings → Database → Connection String → URI
6. Copiar a string e colar no .env como DATABASE_URL
```

#### Opção C: Neon.tech Cloud (Alternativa)
```
1. Acesse: https://neon.tech/
2. Sign up (GitHub/Google)
3. Create Project
4. Copiar connection string
5. Colar no .env
```

### 2. Editar Arquivo .env

Abra o arquivo `.env` e configure:

```env
# IMPORTANTE: Use as chaves geradas anteriormente!
DATABASE_URL="sua-connection-string-aqui"
JWT_SECRET="d1ef35d22c8527ea3e4561869ade4d01bebf2849621f0d6ceecdadae2d385836"
JWT_REFRESH_SECRET="7a9f20e2bf97816c13b62c3f82a7f4d46d278e31f84a2269edcbe31e9caed0a1"
```

### 3. Rodar Migrations

Após configurar o banco, execute:

```powershell
npm run prisma:migrate
```

Isso vai:
- Criar todas as tabelas no banco
- Aplicar o schema do Prisma

### 4. Popular Banco com Dados Iniciais

```powershell
npm run prisma:seed
```

Isso vai criar:
- 3 Entidades (Escola, Condomínio, Empresa)
- 5 Usuários (SuperAdmin, Admins, Operador, User)
- Alguns registros de acesso de exemplo

### 5. Iniciar Servidor

```powershell
npm run dev
```

Servidor vai rodar em: http://localhost:3000

### 6. Testar API

```powershell
# Health check
curl http://localhost:3000/health

# Login (PowerShell)
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"superadmin@demo.com","password":"senha12345"}'
```

---

## 🎯 RESUMO DOS COMANDOS

```powershell
# Já executado:
✅ npm install
✅ npx prisma generate
✅ Copy-Item .env.example .env

# Próximos (após configurar .env):
⏳ npm run prisma:migrate      # Criar tabelas
⏳ npm run prisma:seed         # Popular dados
⏳ npm run dev                 # Iniciar servidor
⏳ curl http://localhost:3000/health  # Testar
```

---

## 📝 CREDENCIAIS DE TESTE (após seed)

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

---

## 🆘 SE TIVER PROBLEMAS

### "Cannot connect to database"
- Verifique se DATABASE_URL está correto no .env
- Teste a conexão: `npx prisma db pull`

### "Module not found"
```powershell
npm run prisma:generate
```

### "Port 3000 already in use"
```powershell
# Ver processos na porta 3000
netstat -ano | findstr :3000

# Matar processo (substituir PID)
taskkill /PID <numero> /F
```

---

## 📚 DOCUMENTAÇÃO

- [QUICKSTART.md](QUICKSTART.md) - Comandos rápidos
- [SETUP.md](SETUP.md) - Setup detalhado
- [API-QUICK-REFERENCE.md](API-QUICK-REFERENCE.md) - Referência da API

---

## ✅ QUANDO TUDO ESTIVER RODANDO

1. Abra http://localhost:3000/health
2. Deve retornar: `{"status":"ok","timestamp":"..."}`
3. Teste login com as credenciais acima
4. Explore a API com os exemplos em [REQUESTS.md](REQUESTS.md)
5. Use Prisma Studio: `npm run prisma:studio`

---

**🎯 PRÓXIMO PASSO IMEDIATO:**

Configurar o banco de dados no `.env` e então executar:
```powershell
npm run prisma:migrate
```
