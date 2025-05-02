# Brevly

![Upload Widget](.github/assets/thumbnail.png)

Brevly é uma aplicação de encurtamento de URLs dividida em uma API backend (server) e uma interface frontend (web). Este projeto permite criar, gerenciar e acessar URLs encurtadas de forma simples e eficiente.

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

### Backend (server)

Uma API RESTful construída com:

- **Fastify**: Framework web rápido e eficiente
- **Drizzle ORM**: ORM para comunicação com PostgreSQL
- **TypeScript**: Tipagem estática para maior segurança
- **Zod**: Validação de dados
- **CloudFlare R2**: Armazenamento de arquivos para exportações

### Frontend (web)

Interface de usuário construída com:

- **React**: Biblioteca para construção de interfaces
- **Tailwind CSS**: Framework CSS para estilização
- **React Router**: Navegação entre páginas
- **TypeScript**: Tipagem estática
- **Vite**: Build tool para desenvolvimento rápido

## Funcionalidades

- Criação de URLs encurtadas personalizadas
- Redirecionamento para URLs originais
- Contagem de acessos às URLs encurtadas
- Listagem de todas as URLs encurtadas
- Exportação de dados em diferentes formatos
- Exclusão de URLs encurtadas

## Pré-requisitos

- Node.js (v18+)
- Yarn
- PostgreSQL

## Configuração

### Backend

1. Navegue até a pasta `server`:

```bash
cd server
```

2. Instale as dependências:

```bash
yarn install
```

3. Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

4. Configure as variáveis de ambiente:

```
PORT=3333
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/brevly
```

5. Execute as migrações do banco de dados:

```bash
yarn db:migrate
```

6. Inicie o servidor de desenvolvimento:

```bash
yarn dev
```

### Frontend

1. Navegue até a pasta `web`:

```bash
cd web
```

2. Instale as dependências:

```bash
yarn install
```

3. Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

4. Configure o endereço da API:

```
VITE_API_URL=http://localhost:3333
```

5. Inicie o servidor de desenvolvimento:

```bash
yarn dev
```

## Uso

- Acesse o frontend em: `http://localhost:5173`
- API disponível em: `http://localhost:3333`
- Documentação da API: `http://localhost:3333/docs`

## Estrutura de Banco de Dados

O projeto utiliza PostgreSQL com as seguintes tabelas principais:

- `links`: Armazena as URLs originais e suas versões encurtadas
- `exports`: Registro de exportações realizadas

## Deploy

### Backend

```bash
cd server
yarn build
yarn start
```

### Frontend

```bash
cd web
yarn build
```

Os arquivos de build estarão disponíveis na pasta `dist`.

## Licença

MIT
