# Tech Challenge Mobile - Hackathon FIAP

Aplicativo mobile desenvolvido em **React Native (Expo)** com backend em **Node.js**. A solução usa gamificação para aumentar o engajamento dos alunos através de uma "Fazenda Virtual".

---

## 🎯 Visão Geral

- **Professor:** Gestão de turmas, criação de atividades (quizzes) e métricas.
- **Aluno:** Completar atividades para ganhar moedas/XP e desbloquear itens na fazenda.

---

## ✨ Funcionalidades Principais

- **Sistema de níveis e XP**
- **Fazenda:** Plantio, estruturas (celeiro, galinheiro), produção e coleta em tempo real.
- **Mercado:** Compra/venda com travas por nível que necessita ter certas quantidades de atividades concluídas para desbloquear o recurso.

---

## 🏗️ Arquitetura e Tecnologias

- Frontend: React Native (Expo), Moti, Reanimated, Phosphor Icons, Axios, Context API.
- Backend: Node.js, Express, Prisma ORM, PostgreSQL, Bcrypt, JWT.

---

## 🚀 Como Rodar Localmente

Pré-requisitos: `node`, `npm`, `git`, e um servidor PostgreSQL.

### 1 Backend

1. Entre na pasta do backend:

```bash
cd backend
npm install
```

2. Crie um arquivo `.env` na raiz de `backend` com as variáveis:

```env

NODE_ENV="development"
PORT=3333

DATABASE_URL="postgresql://postgres:admin@localhost:5432/techchallenge"
JWT_SECRET="exemplo"

# Senha exigida no App para alguém conseguir se cadastrar como Professor
PROFESSOR_SECRET="exemplo"
```

3. Gere o Prisma Client, aplique o schema e execute a seed:

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

4. Inicie o servidor:

```bash
npm run dev
# ou: npx ts-node src/server.ts (conforme script do package.json)
```

### 2 Frontend (Mobile)

1. Na raiz do projeto (fora da pasta `backend`):

```bash
npm install
npx expo start
```

2. Ajuste a URL da API em `src/services/api.ts` para o IP da sua máquina (ex.: `192.168.x.x`) e a porta usada pelo backend:

```typescript
export const api = axios.create({
  baseURL: 'http://192.168.X.X:3000'
});
```

3. Abra o Expo Go no dispositivo ou use emulador.

**Variáveis de ambiente (Frontend)**

Crie um arquivo `.env` na raiz do projeto (frontend) para expor a URL da API e facilitar a configuração em diferentes redes. Substitua os valores pelo IP/porta do seu backend quando necessário:

```env
EXPO_PUBLIC_API_URL="http://192.168.x.x:xxxx/api"
LAN_IP="192.168.x.x"
PORT="xxxx"
```

No código, você pode acessar `EXPO_PUBLIC_API_URL` via `process.env.EXPO_PUBLIC_API_URL` (Expo automático para variáveis `EXPO_PUBLIC_...`).

---

## 🔑 Credenciais de Teste (seed)

- Professor Admin: `admin@escola.com` | Senha: `123456`
- Aluno Teste: `aluno@escola.com` | Senha: `123456`

---

## 🧩 Desafios e Aprendizados

- Sincronização do tempo entre front e backend para evitar fraudes.
- Resolução de loops infinitos relacionados ao `AuthContext` e `useFocusEffect`.
- Modularização de telas complexas (ex.: Fazenda) em subcomponentes.
- Modelagem relacional com dependências entre itens (Prisma).

---

## 👨‍💻 Autor

Desenvolvido por José Márcio como solução do Hackathon da pós-graduação FIAP.

---

## Fluxo simplificado

Mobile App (React Native) <--> API REST (Node.js/Express)
