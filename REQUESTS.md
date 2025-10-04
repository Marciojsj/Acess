# Coleção de Requests - Thunder Client / Insomnia / Postman

## Variables

```json
{
  "baseUrl": "http://localhost:3000/api",
  "accessToken": "",
  "refreshToken": ""
}
```

---

## 1. Health Check

```
GET http://localhost:3000/health
```

---

## 2. Register

```
POST {{baseUrl}}/auth/register
Content-Type: application/json

{
  "name": "Teste Admin",
  "email": "teste@admin.com",
  "password": "senha12345",
  "role": "ADMIN",
  "phone": "+5511999999999",
  "document": "99999999999"
}
```

---

## 3. Login

```
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "superadmin@demo.com",
  "password": "senha12345"
}
```

**Resposta:** Copie o `accessToken` para usar nos próximos requests

---

## 4. Refresh Token

```
POST {{baseUrl}}/auth/refresh
Content-Type: application/json

{
  "refreshToken": "{{refreshToken}}"
}
```

---

## 5. Listar Usuários

```
GET {{baseUrl}}/users
Authorization: Bearer {{accessToken}}
```

---

## 6. Criar Entidade

```
POST {{baseUrl}}/entities
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "name": "Minha Escola",
  "type": "SCHOOL",
  "address": "Rua Exemplo, 123",
  "phone": "+5511988888888",
  "email": "contato@minhaescola.com",
  "maxUsers": 500
}
```

---

## 7. Listar Entidades

```
GET {{baseUrl}}/entities
Authorization: Bearer {{accessToken}}
```

---

## 8. Criar Registro de Acesso (Usuário)

```
POST {{baseUrl}}/access
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "userId": "uuid-do-usuario",
  "entityId": "uuid-da-entidade",
  "type": "ENTRY",
  "status": "AUTHORIZED",
  "method": "CARD",
  "notes": "Entrada normal"
}
```

---

## 9. Criar Registro de Acesso (Visitante)

```
POST {{baseUrl}}/access
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "visitorName": "João Visitante",
  "visitorDoc": "12345678900",
  "visitorPhone": "+5511977777777",
  "entityId": "uuid-da-entidade",
  "type": "ENTRY",
  "status": "AUTHORIZED",
  "method": "MANUAL"
}
```

---

## 10. Gerar QR Code para Visitante

```
POST {{baseUrl}}/access/qrcode/generate
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "visitorName": "Maria Visitante",
  "visitorDoc": "98765432100",
  "visitorPhone": "+5511966666666",
  "entityId": "uuid-da-entidade",
  "validHours": 24
}
```

---

## 11. Validar QR Code

```
GET {{baseUrl}}/access/qrcode/validate/{CODE}
Authorization: Bearer {{accessToken}}
```

---

## 12. Usar QR Code (Registrar Entrada)

```
POST {{baseUrl}}/access/qrcode/use/{CODE}
Authorization: Bearer {{accessToken}}
```

---

## 13. Listar Acessos

```
GET {{baseUrl}}/access
Authorization: Bearer {{accessToken}}
```

Com filtros:
```
GET {{baseUrl}}/access?type=ENTRY&status=AUTHORIZED&startDate=2024-01-01
Authorization: Bearer {{accessToken}}
```

---

## 14. Estatísticas de Acesso

```
GET {{baseUrl}}/access/stats
Authorization: Bearer {{accessToken}}
```

---

## 15. Buscar Usuário por ID

```
GET {{baseUrl}}/users/{USER_ID}
Authorization: Bearer {{accessToken}}
```

---

## 16. Atualizar Usuário

```
PUT {{baseUrl}}/users/{USER_ID}
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "name": "Nome Atualizado",
  "phone": "+5511955555555",
  "isActive": true
}
```

---

## 17. Deletar Usuário

```
DELETE {{baseUrl}}/users/{USER_ID}
Authorization: Bearer {{accessToken}}
```

---

## 18. Atualizar Entidade

```
PUT {{baseUrl}}/entities/{ENTITY_ID}
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "name": "Nome Atualizado",
  "maxUsers": 1000,
  "isActive": true
}
```

---

## 19. Logout

```
POST {{baseUrl}}/auth/logout
Content-Type: application/json

{
  "refreshToken": "{{refreshToken}}"
}
```

---

## Notas

1. Após fazer login, copie o `accessToken` e use em todos os requests autenticados
2. O token expira em 15 minutos (configurável no .env)
3. Use o refresh token para obter um novo access token sem fazer login novamente
4. SUPERADMIN tem acesso a tudo
5. ADMIN só vê dados da sua entidade
6. OPERATOR pode registrar acessos
7. USER tem acesso básico de leitura
