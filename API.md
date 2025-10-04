# API Documentation - Sistema de Controle de Acesso

## Base URL

```
http://localhost:3000/api
```

## Autenticação

A maioria dos endpoints requer autenticação via JWT. Inclua o token no header:

```
Authorization: Bearer {accessToken}
```

---

## 🔐 Auth Endpoints

### POST /auth/register

Registrar novo usuário.

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha12345",
  "role": "USER",
  "entityId": "uuid-da-entidade",
  "phone": "+5511999999999",
  "document": "12345678900"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "USER",
  "entityId": "uuid-da-entidade"
}
```

### POST /auth/login

Fazer login no sistema.

**Request Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha12345"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "USER",
    "entityId": "uuid"
  }
}
```

### POST /auth/refresh

Renovar access token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGc..."
}
```

### POST /auth/logout

Fazer logout (invalidar refresh token).

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:** `200 OK`
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

## 👥 Users Endpoints

### GET /users

Listar usuários. **Requer:** ADMIN ou SUPERADMIN

**Query Params:** Nenhum

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "USER",
    "entityId": "uuid",
    "entity": { ... },
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /users/:id

Buscar usuário por ID. **Requer:** ADMIN ou SUPERADMIN

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "USER",
  "phone": "+5511999999999",
  "document": "12345678900",
  "isActive": true
}
```

### POST /users

Criar novo usuário. **Requer:** ADMIN ou SUPERADMIN

**Request Body:** (igual ao /auth/register)

### PUT /users/:id

Atualizar usuário. **Requer:** ADMIN ou SUPERADMIN

**Request Body:**
```json
{
  "name": "João Silva Atualizado",
  "phone": "+5511988888888",
  "isActive": false
}
```

### DELETE /users/:id

Deletar usuário. **Requer:** SUPERADMIN

**Response:** `200 OK`
```json
{
  "message": "Usuário deletado com sucesso"
}
```

---

## 🏢 Entities Endpoints

### GET /entities

Listar entidades. **Requer:** ADMIN ou SUPERADMIN

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "Escola Exemplo",
    "type": "SCHOOL",
    "address": "Rua das Flores, 123",
    "phone": "+5511999999999",
    "email": "contato@escola.com",
    "isActive": true,
    "users": [ ... ]
  }
]
```

### POST /entities

Criar entidade. **Requer:** SUPERADMIN

**Request Body:**
```json
{
  "name": "Escola Exemplo",
  "type": "SCHOOL",
  "address": "Rua das Flores, 123",
  "phone": "+5511999999999",
  "email": "contato@escola.com",
  "maxUsers": 200
}
```

**Tipos válidos:** `SCHOOL`, `CONDOMINIUM`, `COMPANY`, `EVENT`

---

## 🚪 Access Endpoints

### GET /access

Listar registros de acesso. **Requer:** Autenticação

**Query Params:**
- `type`: ENTRY | EXIT
- `status`: AUTHORIZED | DENIED | PENDING
- `startDate`: ISO date string
- `endDate`: ISO date string

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "user": { ... },
    "entityId": "uuid",
    "entity": { ... },
    "type": "ENTRY",
    "status": "AUTHORIZED",
    "method": "CARD",
    "timestamp": "2024-01-01T10:00:00.000Z",
    "operator": { ... }
  }
]
```

### GET /access/stats

Estatísticas de acesso. **Requer:** Autenticação

**Response:** `200 OK`
```json
{
  "total": 1500,
  "entries": 800,
  "exits": 700,
  "today": 45
}
```

### POST /access

Criar registro de acesso. **Requer:** OPERATOR, ADMIN ou SUPERADMIN

**Request Body:**
```json
{
  "userId": "uuid",
  "entityId": "uuid",
  "type": "ENTRY",
  "status": "AUTHORIZED",
  "method": "CARD",
  "notes": "Acesso autorizado"
}
```

**Para visitantes:**
```json
{
  "visitorName": "João Visitante",
  "visitorDoc": "12345678900",
  "visitorPhone": "+5511999999999",
  "entityId": "uuid",
  "type": "ENTRY",
  "status": "AUTHORIZED",
  "method": "MANUAL"
}
```

### POST /access/qrcode/generate

Gerar QR Code para visitante. **Requer:** ADMIN ou SUPERADMIN

**Request Body:**
```json
{
  "visitorName": "João Visitante",
  "visitorDoc": "12345678900",
  "visitorPhone": "+5511999999999",
  "entityId": "uuid",
  "validHours": 24
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "code": "abc123xyz",
  "visitorName": "João Visitante",
  "validUntil": "2024-01-02T10:00:00.000Z",
  "qrCodeImage": "data:image/png;base64,..."
}
```

### GET /access/qrcode/validate/:code

Validar QR Code. **Requer:** OPERATOR, ADMIN ou SUPERADMIN

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "code": "abc123xyz",
  "visitorName": "João Visitante",
  "validUntil": "2024-01-02T10:00:00.000Z",
  "used": false
}
```

### POST /access/qrcode/use/:code

Usar QR Code (registra entrada). **Requer:** OPERATOR, ADMIN ou SUPERADMIN

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "visitorName": "João Visitante",
  "type": "ENTRY",
  "status": "AUTHORIZED",
  "method": "QR_CODE",
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

---

## ❌ Error Responses

Todos os erros seguem o formato:

```json
{
  "status": "error",
  "message": "Descrição do erro"
}
```

**Status Codes:**
- `400` - Bad Request (dados inválidos)
- `401` - Unauthorized (não autenticado)
- `403` - Forbidden (sem permissão)
- `404` - Not Found (recurso não encontrado)
- `409` - Conflict (email/documento duplicado)
- `500` - Internal Server Error

---

## 📝 Notas

- Todos os IDs são UUIDs
- Timestamps são em formato ISO 8601
- Senhas devem ter no mínimo 8 caracteres
- Emails devem ser únicos
- Documentos devem ser únicos (se fornecidos)
