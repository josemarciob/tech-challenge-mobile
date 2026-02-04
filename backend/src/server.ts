import dotenv from "dotenv";
dotenv.config();

import app from "./app";

// Validação de segurança
if (!process.env.DATABASE_URL) {
  console.error("Erro fatal: DATABASE_URL não configurada no .env");
  process.exit(1);
}

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = "0.0.0.0"; // Importante para Docker e redes locais

app.listen(PORT, HOST, () => {
  console.log(`
  Servidor Acadêmico Online!
  Porta: ${PORT}
  Host: ${HOST}
  Data: ${new Date().toLocaleString()}
  `);
});