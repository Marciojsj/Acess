# 🎯 API ENDPOINTS - Resumo Visual

## 📍 Base URL
```
http://localhost:3000/api
```

---

## 🔐 AUTH - `/api/auth`

| Método | Endpoint | Descrição | Auth | Payload |
|--------|----------|-----------|------|---------|
| `POST` | `/auth/login` | Login no sistema | ❌ | `email, password` |
| `POST` | `/auth/register` | Criar conta | ❌ | `name, email, password, role` |
| `POST` | `/auth/refresh` | Renovar token | ❌ | `refreshToken` |
| `POST` | `/auth/logout` | Sair do sistema | ❌ | `refreshToken` |

**Exemplo:**
```bash
POST /api/auth/login
{ "email": "admin@demo.com", "password": "senha12345" }

→ Returns: { accessToken, refreshToken, user }
```

---

## 👥 USERS - `/api/users`

| Método | Endpoint | Descrição | Permissão | Payload |
|--------|----------|-----------|-----------|---------|
| `GET` | `/users` | Listar usuários | ADMIN+ | - |
| `GET` | `/users/:id` | Buscar usuário | ADMIN+ | - |
| `POST` | `/users` | Criar usuário | ADMIN+ | `name, email, password` |
| `PUT` | `/users/:id` | Atualizar usuário | ADMIN+ | `name, phone, isActive` |
| `DELETE` | `/users/:id` | Deletar usuário | SUPERADMIN | - |

**Exemplo:**
```bash
GET /api/users
Authorization: Bearer {token}

→ Returns: [{ id, name, email, role, ... }]
```

---

## 🏢 ENTITIES - `/api/entities`

| Método | Endpoint | Descrição | Permissão | Payload |
|--------|----------|-----------|-----------|---------|
| `GET` | `/entities` | Listar entidades | ADMIN+ | - |
| `GET` | `/entities/:id` | Buscar entidade | ADMIN+ | - |
| `POST` | `/entities` | Criar entidade | SUPERADMIN | `name, type, address` |
| `PUT` | `/entities/:id` | Atualizar entidade | SUPERADMIN | `name, maxUsers` |
| `DELETE` | `/entities/:id` | Deletar entidade | SUPERADMIN | - |

**Exemplo:**
```bash
POST /api/entities
Authorization: Bearer {token}
{ "name": "Escola ABC", "type": "SCHOOL" }

→ Returns: { id, name, type, ... }
```

---

## 🚪 ACCESS - `/api/access`

### Registros de Acesso

| Método | Endpoint | Descrição | Permissão | Payload |
|--------|----------|-----------|-----------|---------|
| `GET` | `/access` | Listar registros | Todos | `?type=ENTRY&status=AUTHORIZED` |
| `GET` | `/access/stats` | Estatísticas | Todos | - |
| `GET` | `/access/:id` | Buscar registro | Todos | - |
| `POST` | `/access` | Criar registro | OPERATOR+ | `userId, type, status` |

**Exemplo:**
```bash
POST /api/access
Authorization: Bearer {token}
{ "userId": "uuid", "type": "ENTRY", "status": "AUTHORIZED" }

→ Returns: { id, type, status, timestamp, ... }
```

### QR Code para Visitantes

| Método | Endpoint | Descrição | Permissão | Payload |
|--------|----------|-----------|-----------|---------|
| `POST` | `/access/qrcode/generate` | Gerar QR Code | ADMIN+ | `visitorName, validHours` |
| `GET` | `/access/qrcode/validate/:code` | Validar QR Code | OPERATOR+ | - |
| `POST` | `/access/qrcode/use/:code` | Usar QR Code | OPERATOR+ | - |

**Exemplo:**
```bash
POST /api/access/qrcode/generate
Authorization: Bearer {token}
{ "visitorName": "João Silva", "validHours": 24 }

→ Returns: { code, qrCodeImage, validUntil }
```

---

## 🎭 PERMISSÕES

| Role | Acesso |
|------|--------|
| `SUPERADMIN` | ✅ Tudo |
| `ADMIN` | ✅ Gestão da entidade, usuários, acessos |
| `OPERATOR` | ✅ Registrar acessos, validar QR codes |
| `USER` | ✅ Ver dados básicos |
| `VISITOR` | ✅ Acesso via QR code |

---

## 📊 QUERY PARAMS

### GET /api/access
```
?type=ENTRY              # Filtrar por tipo (ENTRY/EXIT)
?status=AUTHORIZED       # Filtrar por status
?startDate=2024-01-01    # Data inicial
?endDate=2024-12-31      # Data final
```

---

## 🔄 FLUXO TÍPICO

### 1️⃣ Login
```bash
POST /api/auth/login
{ "email": "admin@demo.com", "password": "senha12345" }
```
↓ Retorna `accessToken`

### 2️⃣ Usar Token nas Requisições
```bash
GET /api/users
Authorization: Bearer {accessToken}
```

### 3️⃣ Renovar Token (quando expirar)
```bash
POST /api/auth/refresh
{ "refreshToken": "{refreshToken}" }
```
↓ Retorna novo `accessToken`

### 4️⃣ Logout
```bash
POST /api/auth/logout
{ "refreshToken": "{refreshToken}" }
```

---

## 📝 RESPONSE FORMATS

### Sucesso
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  ...
}
```

### Lista
```json
[
  { "id": "uuid-1", ... },
  { "id": "uuid-2", ... }
]
```

### Erro
```json
{
  "status": "error",
  "message": "Descrição do erro"
}
```

---

## 🚨 STATUS CODES

| Code | Significado |
|------|-------------|
| `200` | ✅ OK |
| `201` | ✅ Created |
| `400` | ❌ Bad Request (dados inválidos) |
| `401` | ❌ Unauthorized (não autenticado) |
| `403` | ❌ Forbidden (sem permissão) |
| `404` | ❌ Not Found |
| `409` | ❌ Conflict (email/doc duplicado) |
| `500` | ❌ Internal Server Error |

---

## 🎯 USE CASES

### Registrar entrada de usuário
```bash
1. Operador faz login
2. POST /api/access
   { "userId": "uuid", "type": "ENTRY" }
```

### Gerar QR Code para visitante
```bash
1. Admin faz login
2. POST /api/access/qrcode/generate
   { "visitorName": "João", "validHours": 24 }
3. Enviar QR code por email/WhatsApp
```

### Validar QR Code na portaria
```bash
1. Visitante mostra QR code
2. Operador escaneia
3. GET /api/access/qrcode/validate/{code}
4. POST /api/access/qrcode/use/{code}
   → Registra entrada automaticamente
```

### Ver estatísticas
```bash
1. Usuário autenticado
2. GET /api/access/stats
   → { total: 1500, entries: 800, exits: 700, today: 45 }
```

---

## 🔍 HEALTH CHECK

```bash
GET /health

→ { "status": "ok", "timestamp": "2024-01-01T00:00:00.000Z" }
```

---

## 📚 DOCUMENTAÇÃO COMPLETA

Para mais detalhes, veja:
- `API.md` - Documentação completa
- `REQUESTS.md` - Exemplos práticos
- `QUICKSTART.md` - Comandos rápidos

---

**🚀 API pronta para uso!**
