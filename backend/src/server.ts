// src/server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Carregar variáveis de ambiente primeiro
dotenv.config();

import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import postRoutes from "./routes/posts";
import atividadeRoutes from "./routes/atividades";
import commentRoutes from "./routes/comments";

const app = express();
app.use(express.json());
app.use(cors());

// Debug simples para requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rotas principais
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/atividades", atividadeRoutes);
app.use("/comments", commentRoutes);

// Rota padrão para erros 404
app.use((req, res) => {
  res.status(404).json({ error: `Error: ${req.method} ${req.path}` });
});

// Verificar se DATABASE_URL está definida
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL não está definida no .env");
  process.exit(1);
}

// Inicialização do servidor
const HOST = "0.0.0.0";

// Função para obter porta de forma segura
function getPort(): number {
  const envPort = process.env.PORT;
  if (!envPort) return 3000;
  
  const parsedPort = parseInt(envPort, 10);
  if (isNaN(parsedPort)) {
    console.warn(`⚠️ PORT "${envPort}" não é um número válido. Usando 3000.`);
    return 3000;
  }
  
  if (parsedPort < 1 || parsedPort > 65535) {
    console.warn(`⚠️ PORT ${parsedPort} fora do intervalo válido (1-65535). Usando 3000.`);
    return 3000;
  }
  
  return parsedPort;
}

const PORT = getPort();

app.listen(PORT, HOST, () => {
  console.log(`✅ Backend rodando na porta ${PORT} (host=${HOST})`);
  console.log(`📦 Database URL: ${process.env.DATABASE_URL?.split('@')[1]}`);
});

export default app;