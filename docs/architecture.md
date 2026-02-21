# Arquitetura & Fluxos — Resumo Técnico

Breve visão do core, modelos e fluxos principais (recompensas e validações).

## Core do sistema
- Backend autoritativo: aplica regras de gamificação, valida dependências e mantém consistência temporal.
- Banco: PostgreSQL via Prisma (schema em `backend/prisma/schema.prisma`).
- Frontend: Expo/React Native consome a API REST; `src/services/api.ts` monta baseURL a partir de env.

## Modelos centrais
- `User` — progresso, XP, moedas, nível, atividade concluída.
- `StoreItem` — itens do mercado (plantas, animais, estruturas), com requisitos e dependências.
- `UserFarmItem` — instâncias de itens alocados na fazenda de um usuário.
- `UserResource` — inventário do usuário (quantidade por item).
- `Post` / `Question` / `Option` — atividades/quiz.
- `QuizAttempt` — tentativas/resultados das atividades.

## Fluxo: recompensa e desbloqueio (passo-a-passo)
1. Usuário finaliza um quiz no app; frontend envia respostas para a rota de submissão (ex.: `POST /quizzes/:id/submit`).
2. Backend calcula a pontuação (verifica respostas corretas) e cria um registro `QuizAttempt`.
3. Backend decide recompensas: XP e moedas calculadas a partir da pontuação e regras de negócio.
4. Backend atualiza `User` (incrementa `xp`, `coins`, `completedActivities`) e marca recompensa `rewardClaimed` quando aplicável.
5. Ao atualizar `completedActivities` ou `level`, backend valida se itens em `StoreItem` agora atendem `unlockLevel` e `requiredActivities`.
6. Operações de compra/venda ou plantio são validadas pelo backend (ex.: verificar se o usuário possui construções necessárias, capacidade do armazém, saldo de moedas).
7. Para produção/colheita com temporizadores, backend registra timestamps (`createdAt`, `lastFed`) e calcula disponibilidade com base em `growthTime`/`productionRate` — sempre checado no servidor para evitar fraudes locais.

## Fluxo: operações da fazenda
- Plantio: cria `UserFarmItem` referenciando `StoreItem` e timestamp inicial.
- Produção: backend calcula output com base em `productionRate` e último timestamp.
- Coleta: ao coletar, backend move quantidade para `UserResource` e atualiza timestamps/estado do `UserFarmItem`.

## Segurança e autenticação
- Autenticação via JWT; middleware de proteção em rotas sensíveis.
- Registro de professores protegido por `PROFESSOR_SECRET` (variável de ambiente).

## Observações operacionais
- Não confiar em timestamps do cliente — toda validação temporal acontece no backend.
- Usar `EXPO_PUBLIC_API_URL` ou `LAN_IP` + `PORT` no frontend para apontar a API local.
- Arquivo de configuração: veja `backend/.env.example` e `.env.example` (frontend).

## Diagrama ER
Veja `docs/er-diagram.md` (Mermaid) para o diagrama de entidades e relacionamentos.
