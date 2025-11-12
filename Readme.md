# MotoHub API

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

API RESTful para o MotoHub, um sistema de compra e venda de motocicletas. O projeto permite que Lojas se cadastrem para anunciar motos e Usuários se cadastrem para visualizá-las e gerenciar suas compras.

## Funcionalidades Principais

* **Autenticação JWT**: Sistema de login e registro separado para `Usuários` (clientes) e `Lojas` (vendedores).
* **CRUD de Usuários**: Operações para criar, ler, atualizar e checar usuários.
* **CRUD de Lojas**: Operações para criar, ler, atualizar e checar lojas, incluindo upload de imagem de perfil.
* **Gerenciamento de Motocicletas**: Lojas autenticadas podem criar, ler, atualizar e deletar seus próprios anúncios de motos, incluindo upload de múltiplas imagens.
* **Histórico de Vendas**: Lojas podem marcar motos como "vendidas" e usuários podem ver as motos que adquiriram.

## Tecnologias Utilizadas

* **TypeScript**: Linguagem principal do projeto.
* **Node.js**: Ambiente de execução.
* **Express**: Framework para gerenciamento das rotas e da API.
* **MongoDB**: Banco de dados NoSQL para armazenamento.
* **Mongoose**: ODM para modelagem dos dados do MongoDB.
* **JSON Web Tokens (JWT)**: Para geração e verificação de tokens de autenticação.
* **bcrypt**: Para hashing de senhas.
* **Multer**: Middleware para upload de imagens (lojas, usuários e motos).
* **dotenv**: Para gerenciar variáveis de ambiente.

---

## Instalação e Execução

Siga os passos abaixo para configurar e executar o projeto localmente.

### 1. Pré-requisitos

* Node.js (v16 ou superior)
* MongoDB (um cluster no Atlas ou uma instância local)

### 2. Clone o Repositório

```bash
git clone https://github.com/ViniciusAlves03/MotoHub.git
```

### 3. Navegue até a Pasta do Backend

```bash
cd MotoHub/Backend
```

### 4. Instale as Dependências

```bash
npm install
```

### 5. Configure as Variáveis de Ambiente
Copie o arquivo .env.example e substitua os valores de exemplo por seus valores reais
```bash
cp .env.example .env
```

### 6. Execute a Aplicação (Modo de Desenvolvimento)
Isso iniciará o servidor com nodemon, reiniciando automaticamente a cada mudança no código.
```bash
npm run dev
```

O servidor estará rodando em `http://127.0.0.1:5000`

## Estrutura do Projeto

```sh
MotoHub/Backend
├── src/
│   ├── app/
│   │   ├── controllers/  # Lógica de negócio (UserController, StoreController, etc.)
│   │   ├── db/           # Configuração da conexão com MongoDB (conn.ts)
│   │   ├── helpers/      # Funções utilitárias (auth, upload de imagem, etc.)
│   │   ├── models/       # Schemas do Mongoose (User, Store, Motorcycle)
│   │   ├── public/       # Pasta para imagens estáticas (uploads)
│   │   └── routes/       # Definição dos endpoints da API
│   │
│   ├── app.ts            # Configuração principal do Express (middlewares e rotas)
│   └── index.ts          # Ponto de entrada da aplicação (inicializa o servidor)
│
├── .env                  # Arquivo local com segredos (ignorado pelo Git)
├── .env.example          # Arquivo de exemplo para configuração
├── package.json          # Dependências e scripts do projeto
└── tsconfig.json         # Configurações do compilador TypeScript
```

## Documentação da API (Endpoints)

Abaixo está um resumo de todos os endpoints disponíveis na API, agrupados por recurso.

### 👤 User (Usuários Clientes)

Rotas para registro, login e gerenciamento de contas de clientes.

| Método | Rota (Path) | Descrição
| :--- | :--- | :--- |
| `POST` | `/user/register` | Cria um novo usuário (registro). |
| `POST` | `/user/login` | Autentica um usuário e retorna um token JWT. |
| `GET` | `/user/checkuser` | Valida o token e retorna os dados do usuário logado. |
| `GET` | `/user/:id` | Obtém os dados de um usuário específico. |
| `PATCH` | `/user/edit/:id` | Atualiza os dados de um usuário específico. |
| `GET` | `/user/mymotorcycles` | Lista as motocicletas compradas pelo usuário. |
---

### 🏪 Store (Lojas / Vendedores)

Rotas para registro, login e gerenciamento de contas de lojas.

| Método | Rota (Path) | Descrição
| :--- | :--- | :--- |
| `POST` | `/store/register` | Cria uma nova loja (registro), com upload de imagem. |
| `POST` | `/store/login` | Autentica uma loja e retorna um token JWT. |
| `GET` | `/store/checkstore` | Valida o token e retorna os dados da loja logada. |
| `GET` | `/store/:id` | Obtém os dados de uma loja específica. |
| `PATCH` | `/store/edit/:id` | Atualiza os dados de uma loja específica. |
---

### 🏍️ Motorcycle (Motocicletas)

Rotas para visualização e gerenciamento de anúncios de motocicletas.

| Método | Rota (Path) | Descrição
| :--- | :--- | :--- |
| `POST` | `/motorcycle/create` | Cria um novo anúncio de moto (requer loja). |
| `GET` | `/motorcycle/` | Lista todas as motocicletas de todas as lojas. |
| `GET` | `/motorcycle/mymotorcycles` | Lista todas as motos da loja logada. |
| `GET` | `/motorcycle/mysales` | Lista todas as motos vendidas pela loja logada. |
| `GET` | `/motorcycle/:id` | Obtém os dados de uma moto específica. |
| `DELETE` | `/motorcycle/delete/:id` | Deleta um anúncio de moto (requer loja). |
| `PATCH` | `/motorcycle/edit/:id` | Atualiza um anúncio de moto (requer loja). |
---

## 🧑‍💻 Autor <a id="autor"></a>

<p align="center">Desenvolvido por Vinícius Alves <strong><a href="https://github.com/ViniciusAlves03">(eu)</a></strong>.</p>

---

