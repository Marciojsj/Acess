# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [1.0.0] - 2024-01-XX (PARTE 1 - BACKEND)

### 🎉 Release Inicial - Backend Completo

Esta é a primeira versão completa do Sistema de Controle de Acesso - Backend API.

### ✨ Adicionado

#### Autenticação & Autorização
- Sistema de autenticação JWT completo
- Access Token (15 minutos de validade)
- Refresh Token (7 dias de validade)
- Endpoint de login (`POST /api/auth/login`)
- Endpoint de registro (`POST /api/auth/register`)
- Endpoint de refresh token (`POST /api/auth/refresh`)
- Endpoint de logout (`POST /api/auth/logout`)
- Middleware de autenticação (`authenticate`)
- Middleware de autorização por roles (`permit`)
- 5 níveis de permissão hierárquicos:
  - SUPERADMIN (acesso total)
  - ADMIN (gestão de entidade)
  - OPERATOR (registro de acessos)
  - USER (acesso básico)
  - VISITOR (acesso temporário)

#### Gestão de Usuários
- CRUD completo de usuários
- Endpoint GET `/api/users` (listar usuários)
- Endpoint GET `/api/users/:id` (buscar usuário)
- Endpoint POST `/api/users` (criar usuário)
- Endpoint PUT `/api/users/:id` (atualizar usuário)
- Endpoint DELETE `/api/users/:id` (deletar usuário)
- Validação de email único
- Validação de documento único
- Hash de senhas com bcrypt
- Ativação/desativação de usuários
- Vínculo usuário-entidade

#### Gestão de Entidades
- CRUD completo de entidades
- Endpoint GET `/api/entities` (listar entidades)
- Endpoint GET `/api/entities/:id` (buscar entidade)
- Endpoint POST `/api/entities` (criar entidade)
- Endpoint PUT `/api/entities/:id` (atualizar entidade)
- Endpoint DELETE `/api/entities/:id` (deletar entidade)
- Tipos de entidade: SCHOOL, CONDOMINIUM, COMPANY, EVENT
- Limite de usuários por entidade
- Status ativo/inativo

#### Controle de Acesso
- Sistema completo de registro de acessos
- Endpoint GET `/api/access` (listar registros)
- Endpoint GET `/api/access/stats` (estatísticas)
- Endpoint GET `/api/access/:id` (buscar registro)
- Endpoint POST `/api/access` (criar registro)
- Tipos de acesso: ENTRY (entrada), EXIT (saída)
- Status: AUTHORIZED, DENIED, PENDING
- Métodos: MANUAL, QR_CODE, CARD, BIOMETRIC
- Registro de visitantes (sem usuário cadastrado)
- Filtros por tipo, status, data
- Estatísticas em tempo real (total, entradas, saídas, hoje)
- Registro do operador responsável

#### QR Code para Visitantes
- Sistema completo de QR Code temporário
- Endpoint POST `/api/access/qrcode/generate` (gerar QR Code)
- Endpoint GET `/api/access/qrcode/validate/:code` (validar)
- Endpoint POST `/api/access/qrcode/use/:code` (usar e registrar)
- Geração de QR Code com imagem base64
- Controle de validade em horas
- Uso único (marca como usado)
- Registro automático de entrada ao usar

#### Banco de Dados
- Schema Prisma completo
- 5 modelos: User, Entity, AccessLog, RefreshToken, VisitorQRCode
- 4 enums: Role, EntityType, AccessType, AccessStatus
- Migrations versionadas
- Seed com dados de exemplo
- Relacionamentos bem definidos
- Índices nos campos chave

#### Segurança
- Helmet (HTTP security headers)
- CORS configurado
- Hash de senhas com bcrypt (10 rounds)
- JWT tokens seguros
- Validação de dados de entrada
- Prisma (previne SQL injection)
- Error handling global
- express-async-errors

#### Utilitários
- Sistema de envio de emails (nodemailer)
- Gerador de QR Code (qrcode)
- Validações (email, senha, telefone)
- Cliente Prisma centralizado

#### Documentação
- README.md completo
- INDEX.md (índice de documentação)
- RESUMO.md (resumo executivo)
- INSTALL.md (guia de instalação)
- SETUP.md (setup detalhado)
- QUICKSTART.md (comandos rápidos)
- API.md (documentação completa da API)
- API-QUICK-REFERENCE.md (referência rápida)
- REQUESTS.md (exemplos de requests)
- ESTRUTURA.md (arquitetura)
- ROADMAP.md (próximas partes)
- PARTE-1-COMPLETA.md (status)
- prisma/README.md (documentação Prisma)

#### Configuração
- package.json com scripts úteis
- tsconfig.json configurado
- jest.config.js para testes
- .env.example detalhado
- .gitignore completo

#### Testes
- Setup de testes com Jest
- Exemplo de testes de integração
- Configuração para Supertest

### 🛠️ Tecnologias

- Node.js 18+
- TypeScript 5.3
- Express 4.18
- Prisma 5.7
- PostgreSQL 14+
- JWT (jsonwebtoken)
- bcrypt
- QRCode
- Nodemailer
- Helmet
- CORS
- Jest
- Supertest

### 📊 Estatísticas

- **Arquivos criados**: 31
- **Linhas de código**: ~2000
- **Endpoints**: 21
- **Models**: 5
- **Controllers**: 4
- **Services**: 4
- **Middlewares**: 3
- **Documentos**: 13

### 🔧 Scripts npm

```json
{
  "dev": "Servidor em desenvolvimento com hot reload",
  "build": "Build para produção",
  "start": "Iniciar servidor em produção",
  "prisma:generate": "Gerar Prisma Client",
  "prisma:migrate": "Rodar migrations",
  "prisma:studio": "Abrir Prisma Studio",
  "prisma:seed": "Popular banco com dados iniciais",
  "test": "Rodar testes",
  "test:watch": "Testes em watch mode"
}
```

### 📝 Credenciais de Teste (Seed)

```
Super Admin:
  Email: superadmin@demo.com
  Senha: senha12345

Admin Escola:
  Email: admin.escola@demo.com
  Senha: senha12345

Operador Portaria:
  Email: operador.escola@demo.com
  Senha: senha12345

Admin Condomínio:
  Email: admin.condo@demo.com
  Senha: senha12345

Usuário Empresa:
  Email: usuario.empresa@demo.com
  Senha: senha12345
```

### 🎯 Endpoints por Categoria

#### Auth (4 endpoints)
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/refresh
- POST /api/auth/logout

#### Users (5 endpoints)
- GET /api/users
- GET /api/users/:id
- POST /api/users
- PUT /api/users/:id
- DELETE /api/users/:id

#### Entities (5 endpoints)
- GET /api/entities
- GET /api/entities/:id
- POST /api/entities
- PUT /api/entities/:id
- DELETE /api/entities/:id

#### Access (7 endpoints)
- GET /api/access
- GET /api/access/stats
- GET /api/access/:id
- POST /api/access
- POST /api/access/qrcode/generate
- GET /api/access/qrcode/validate/:code
- POST /api/access/qrcode/use/:code

### 🔐 Permissões por Role

| Endpoint | SUPERADMIN | ADMIN | OPERATOR | USER | VISITOR |
|----------|------------|-------|----------|------|---------|
| Auth | ✅ | ✅ | ✅ | ✅ | ✅ |
| Users | ✅ | ✅ | ❌ | ❌ | ❌ |
| Entities | ✅ | 🔶 View | ❌ | ❌ | ❌ |
| Access | ✅ | ✅ | ✅ | 🔶 View | ❌ |
| QR Code Gen | ✅ | ✅ | ❌ | ❌ | ❌ |
| QR Code Use | ✅ | ✅ | ✅ | ❌ | ❌ |

### 🎓 Boas Práticas Implementadas

- ✅ TypeScript para type safety
- ✅ Arquitetura em camadas (routes → controllers → services)
- ✅ Separação de responsabilidades
- ✅ Código modular e reutilizável
- ✅ Error handling centralizado
- ✅ Validações consistentes
- ✅ RESTful API design
- ✅ JWT stateless authentication
- ✅ Password hashing
- ✅ Role-based access control
- ✅ Documentação completa
- ✅ Exemplos práticos

### ⚠️ Limitações Conhecidas

- Sem paginação nos endpoints
- Sem rate limiting
- Sem logs estruturados
- Sem testes E2E
- Sem WebSockets (tempo real)
- Sem upload de imagens
- Email apenas SMTP básico
- Sem internacionalização (i18n)

### 🔮 Próximas Versões

Ver [ROADMAP.md](ROADMAP.md) para:
- v1.1.0 - PARTE 2: Frontend (Next.js)
- v1.2.0 - PARTE 3: Design System
- v1.3.0 - PARTE 4: Deploy & Segurança
- v2.0.0 - Features avançadas

---

## [Unreleased]

### 🎯 Planejado para v1.1.0 (PARTE 2 - Frontend)

- Dashboard com Next.js 14
- Interface de gestão
- Scanner de QR Code
- Design responsivo
- Tema dark/light
- Gráficos e relatórios

### 🎯 Planejado para v1.2.0 (PARTE 3 - Design System)

- Componentes reutilizáveis
- Tema customizável
- Acessibilidade (WCAG)
- Animações
- Storybook

### 🎯 Planejado para v1.3.0 (PARTE 4 - Deploy)

- Rate limiting
- CI/CD (GitHub Actions)
- Deploy automatizado
- Monitoramento (Sentry)
- Logs estruturados
- Testes E2E

### 🎯 Planejado para v2.0.0 (Features Avançadas)

- WebSockets (tempo real)
- Upload de imagens
- App mobile
- Notificações push
- Reconhecimento facial
- Integração com hardware (catracas)
- Relatórios avançados (BI)
- Multi-idiomas (i18n)

---

## Convenções de Versionamento

Este projeto usa [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.x.x): Mudanças incompatíveis na API
- **MINOR** (x.1.x): Novas funcionalidades (compatíveis)
- **PATCH** (x.x.1): Correções de bugs (compatíveis)

---

## Links

- [Repositório](https://github.com/seu-usuario/access-control)
- [Documentação](./README.md)
- [Issues](https://github.com/seu-usuario/access-control/issues)
- [Roadmap](./ROADMAP.md)

---

**🎉 Versão 1.0.0 - Backend completo e funcional!**
