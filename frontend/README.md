# Frontend - Sistema de Controle de Acesso

Frontend do sistema de controle de acesso desenvolvido com Next.js 14, TypeScript, TailwindCSS e Shadcn/ui.

## 🚀 Tecnologias

- **Next.js 15.5.4** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **TailwindCSS v4** - Estilização utilitária
- **Shadcn/ui** - Componentes de UI
- **Zustand** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **React Query** - Cache e sincronização de dados
- **React QR Code** - Geração de QR Codes
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones

## 🚀 Como Rodar

### Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento (porta 3001)
npm run dev
```

Acesse: http://localhost:3001

### Produção

```bash
# Build para produção
npm run build

# Iniciar servidor de produção
npm start
```

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🔐 Credenciais de Teste

- **Super Admin:** superadmin@demo.com / senha12345
- **Admin Escola:** admin.escola@demo.com / senha12345
- **Operador:** operador.escola@demo.com / senha12345

## 📁 Estrutura do Projeto

```
frontend/
├── app/                        # App Router do Next.js
│   ├── login/                  # Página de login
│   ├── dashboard/              # Área autenticada
│   │   ├── layout.tsx          # Layout com Sidebar + Navbar
│   │   ├── page.tsx            # Dashboard principal
│   │   ├── users/              # Módulo de Usuários (CRUD completo)
│   │   ├── entities/           # Módulo de Entidades (CRUD completo)
│   │   ├── access/             # Módulo de Controle de Acesso
│   │   ├── visitors/           # Módulo de Visitantes (QR Code)
│   │   └── config/             # Configurações
│   └── globals.css             # Estilos globais
├── components/                 # Componentes React
│   ├── ui/                     # Componentes Shadcn/ui
│   └── layout/                 # Sidebar e Navbar
├── lib/                        # Utilitários
│   ├── api.ts                  # Cliente Axios configurado
│   └── utils.ts                # Funções utilitárias
├── store/                      # Estado global (Zustand)
│   └── auth.ts                 # Store de autenticação
└── types/                      # Tipos TypeScript
    └── index.ts                # Tipos compartilhados
```

## 🎯 Funcionalidades

### Dashboard
- ✅ Estatísticas em tempo real (total, entradas, saídas, hoje)
- ✅ Cards com dados do backend
- ✅ Navegação rápida

### Usuários
- ✅ Listagem com tabela
- ✅ Criar novo usuário
- ✅ Visualizar detalhes
- ✅ Editar usuário
- ✅ Deletar usuário
- ✅ Badges por função (SUPERADMIN, ADMIN, OPERATOR, RESIDENT, GUARD)

### Entidades
- ✅ Listagem com tabela
- ✅ Criar nova entidade
- ✅ Visualizar detalhes
- ✅ Editar entidade
- ✅ Deletar entidade
- ✅ Badges por tipo (SCHOOL, CONDOMINIUM, COMPANY, EVENT)

### Controle de Acesso
- ✅ Histórico completo de entradas e saídas
- ✅ Filtros avançados (usuário, entidade, tipo, período)
- ✅ Busca por nome/entidade
- ✅ Registrar acesso manual
- ✅ Exportar relatórios (CSV)

### Visitantes (QR Code)
- ✅ Gerar QR Code para visitantes
- ✅ Lista de QR Codes (ativos/usados/expirados)
- ✅ Visualizar e imprimir QR Code
- ✅ Scanner de QR Code (manual)
- ✅ Validação e registro automático de acesso
- ✅ QR Code temporário com expiração configurável
- ✅ Download de QR Code como imagem

## 🛣️ Rotas

### Públicas
- `/login` - Página de login

### Protegidas
- `/dashboard` - Dashboard principal
- `/dashboard/users` - Gerenciamento de usuários
- `/dashboard/users/new` - Criar usuário
- `/dashboard/users/[id]` - Detalhes do usuário
- `/dashboard/users/[id]/edit` - Editar usuário
- `/dashboard/entities` - Gerenciamento de entidades
- `/dashboard/entities/new` - Criar entidade
- `/dashboard/entities/[id]` - Detalhes da entidade
- `/dashboard/entities/[id]/edit` - Editar entidade
- `/dashboard/access` - Histórico de acessos
- `/dashboard/access/register` - Registrar acesso manual
- `/dashboard/visitors` - Lista de QR Codes
- `/dashboard/visitors/new` - Gerar QR Code
- `/dashboard/visitors/[id]` - Visualizar QR Code
- `/dashboard/visitors/scanner` - Scanner de QR Code
- `/dashboard/config` - Configurações

## 📡 Integração com API

Backend rodando em `http://localhost:3000`

### Endpoints Utilizados

- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Logout
- `GET /users` - Listar usuários
- `GET /entities` - Listar entidades
- `GET /access` - Listar acessos
- `GET /access/stats` - Estatísticas
- `GET /access/qrcode` - Listar QR Codes
- `POST /access/qrcode` - Gerar QR Code
- `POST /access/qrcode/validate` - Validar QR Code

## 🎨 Design System

Design inspirado no **Frappe/ERPNext**:

- Interface limpa e profissional
- Sidebar colapsável
- Navegação por URLs descritivas
- Badges coloridas por status/tipo
- Responsividade mobile-first

## 📦 Scripts

- `dev` - Servidor de desenvolvimento (porta 3001)
- `build` - Build para produção
- `start` - Servidor de produção
- `lint` - ESLint

## 🔒 Autenticação

- JWT tokens (access + refresh)
- Auto-refresh automático
- Persistência com Zustand
- Interceptors Axios para token

## 🐛 Troubleshooting

### Erro de CORS
Verifique se o backend está rodando e configurado corretamente.

### Loop de autenticação
Limpe o localStorage e faça login novamente.

### Componentes não aparecem
Verifique a configuração do TailwindCSS.

## 📄 Licença

Projeto privado - Uso interno

---

**Desenvolvido com Next.js 15 + TypeScript + TailwindCSS**
