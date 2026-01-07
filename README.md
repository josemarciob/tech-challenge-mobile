# 📱 Tech Challenge Mobile

Aplicativo mobile desenvolvido em **React Native (Expo)** para autenticação de usuários e gerenciamento de Atividades (CRUD).  
Parte do desafio do curso **Postech FIAP**.

---

## 🚀 Instalação e execução

1. Clone o repositório:
   ```bash
   git clone https://github.com/SeuUsuario/tech-challenge-mobile.git
   cd tech-challenge-mobile
   ```
2. Instale as dependências:
    npm install

3. Inicie o projeto:
    npx expo start

Escolha rodar no emulador Android/iOS ou no aplicativo Expo Go.

# Configuração do backend
No arquivo src/services/api.ts, ajuste a URL para o backend que estiver rodando:
```bash
export const api = axios.create({
  baseURL: 'http://localhost:3000/api' // ou a URL do servidor
});
```

# Autor
Projeto desenvolvido por José Márcio como parte do Tech Challenge da FIAP.


