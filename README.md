# 📱 Tech Challenge Mobile

Aplicativo mobile desenvolvido em **React Native (Expo)** para autenticação de usuários e gerenciamento de Atividades (CRUD).  
Parte do desafio do curso **Postech FIAP**.

---

## 🏗️ Arquitetura do Sistema

O sistema é composto por duas camadas principais:

- **Frontend (Mobile App)**  
  - Desenvolvido em **React Native (Expo)**.  
  - Gerencia autenticação de usuários (login, registro).  
  - Permite CRUD de atividades (criar, listar, editar, excluir).  
  - Interface diferenciada para **estudantes** e **professores**, com permissões específicas.  

- **Backend (API Node.js/Express)**  
  - Responsável por autenticação e persistência dos dados.  
  - Mantém usuários e atividades em memória (simulação de banco de dados).  
  - Endpoints REST para login, registro e gerenciamento de atividades.  
  - Validação de roles (`estudante` e `professor`) com chave secreta para professores.  

## Fluxo simplificado:

Mobile App (React Native) <--> API REST (Node.js/Express)

---

## 🚀 Instalação e Execução

### Frontend
1. Clone o repositório:
   ```bash
   git clone https://github.com/josemarciob/tech-challenge-mobile.git
   cd tech-challenge-mobile
   ```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o projeto:
```bash
npx expo start
```

4. Escolha rodar no emulador Android/iOS ou no aplicativo Expo Go.

### Backend
No arquivo src/services/api.ts, ajuste a URL para o backend que estiver rodando:
```bash
export const api = axios.create({
  baseURL: 'http://localhost:3000/api' // ou a URL do servidor
});
```
Para iniciar o backend:
```bash
node server.js
```


> ## 📲 Uso da Aplicação
>
> ### Estudante
> - Visualizar atividades disponíveis.
> - Acessar perfil do estudante.
>
> ### Professor
> - Criar novas atividades.
> - Listar todas as atividades.
> - Gerenciar usuários.
> - Acessar perfil do professor.

## 🧩 Experiências e Desafios
### Durante o desenvolvimento, a equipe enfrentou alguns pontos importantes:
+ Consistência de roles: Foi necessário padronizar para "estudante" e "professor" em todo o sistema.
+ Integração frontend-backend: ajustes na tipagem do AuthContext e nas telas para refletir corretamente os dados retornados pela API.
+ Gerenciamento de estado: uso de Context API para manter usuário autenticado e simplificar navegação condicional.
+ Organização dos commits: adoção de mensagens semânticas (feat, fix, refactor, chore) para manter o histórico limpo e rastreável.
+ Divisão entre frontend, backend e documentação, com integração contínua no GitHub.

Esses desafios ajudaram a consolidar boas práticas de desenvolvimento e reforçaram a importância da padronização.

👨‍💻 Autor
Projeto desenvolvido por José Márcio como parte do Tech Challenge da FIAP.

---