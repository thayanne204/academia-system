# 🏋️ Academia System

Sistema web completo para gestão de academias, desenvolvido com Vue.js, Node.js, Express e Supabase.

---

## 📋 Objetivo do Sistema

O Academia System é uma plataforma de gestão interna para academias, permitindo que administradores gerenciem alunos e planos de forma simples, rápida e eficiente. O sistema conta com autenticação segura, dashboard com visão geral e CRUD completo de alunos e planos.

---

## 🚀 Tecnologias Utilizadas

### Front-end
- [Vue.js 3](https://vuejs.org/)
- [Pinia](https://pinia.vuejs.org/) — Gerenciamento de estado
- [Vue Router](https://router.vuejs.org/) — Navegação entre telas
- [Axios](https://axios-http.com/) — Requisições HTTP
- [Vite](https://vitejs.dev/) — Build tool

### Back-end
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [JWT (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken) — Autenticação
- [Bcryptjs](https://github.com/dcodeIO/bcrypt.js) — Criptografia de senhas

### Banco de Dados
- [Supabase](https://supabase.com/) — PostgreSQL na nuvem

### Versionamento
- [GitHub](https://github.com/)

---

## ✅ Funcionalidades Implementadas

- [x] Autenticação (Login e Cadastro)
- [x] Gerenciamento de estado com Pinia
- [x] Proteção de rotas autenticadas
- [x] Dashboard com visão geral (total de alunos, planos, ativos e inativos)
- [x] CRUD completo de Alunos (Cadastrar, Listar, Editar, Excluir)
- [x] CRUD completo de Planos (Cadastrar, Listar, Editar, Excluir)
- [x] Busca de alunos por nome ou email
- [x] Interface responsiva (desktop e mobile)
- [x] Tema dark premium (preto e dourado)

---

## 🗄️ Estrutura do Banco de Dados

### Tabela `usuarios`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Chave primária |
| nome | TEXT | Nome do usuário |
| email | TEXT | Email único |
| senha | TEXT | Senha criptografada |
| created_at | TIMESTAMP | Data de criação |

### Tabela `planos`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Chave primária |
| nome | TEXT | Nome do plano |
| descricao | TEXT | Descrição do plano |
| duracao_meses | INTEGER | Duração em meses |
| preco | NUMERIC | Preço do plano |
| created_at | TIMESTAMP | Data de criação |

### Tabela `alunos`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Chave primária |
| nome | TEXT | Nome do aluno |
| email | TEXT | Email único |
| telefone | TEXT | Telefone |
| data_nascimento | DATE | Data de nascimento |
| plano_id | UUID | Referência ao plano |
| ativo | BOOLEAN | Status do aluno |
| created_at | TIMESTAMP | Data de criação |

---

## 📁 Estrutura do Projeto

```
academia-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── alunosController.js
│   │   │   └── planosController.js
│   │   ├── middlewares/
│   │   │   └── auth.js
│   │   └── routes/
│   │       ├── auth.js
│   │       ├── alunos.js
│   │       └── planos.js
│   ├── server.js
│   └── .env
└── frontend/
    └── src/
        ├── components/
        ├── views/
        │   ├── LoginView.vue
        │   ├── DashboardView.vue
        │   ├── AlunosView.vue
        │   └── PlanosView.vue
        ├── stores/
        │   └── auth.js
        ├── services/
        │   └── api.js
        └── router/
            └── index.js
```

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos
- Node.js instalado
- Conta no Supabase

### 1. Clone o repositório
```bash
git clone https://github.com/thayanne204/academia-system.git
cd academia-system
```

### 2. Configure o Backend
```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend` com:
```
PORT=3000
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_anon
JWT_SECRET=sua_chave_secreta
```

Inicie o backend:
```bash
node server.js
```

### 3. Configure o Frontend
```bash
cd frontend
npm install
npm run dev
```

Acesse: `http://localhost:5173`

---

## 👤 Integrantes

| Nome | Função |
|------|--------|
| Thayanne Oliveira | Desenvolvedora Full Stack |
| Yasmin Moreira | Desenvolvedora Full Stack |

---

## 📸 Telas do Sistema

### Login
> Tela de autenticação com tema dark premium

### Dashboard
> Painel com visão geral: total de alunos, planos, ativos e inativos

### Alunos
> Listagem completa com busca, cadastro, edição e exclusão

### Planos
> Cards de planos com cadastro, edição e exclusão

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.
