import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import prisma from "./prisma"; 
import os from "os"; 

// ==========================================
// VALIDAÇÃO DE AMBIENTE
// ==========================================
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3333;
const HOST = "0.0.0.0"; 

if (!process.env.DATABASE_URL) {
  console.error("ERRO: DATABASE_URL não configurada no .env");
  process.exit(1);
}

const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
};

// ==========================================
// INICIALIZAÇÃO
// ==========================================
async function startServer() {
  try {
    console.log("Conectando ao banco de dados...");
  
    await prisma.$connect();
    console.log("Banco de dados conectado com sucesso.");

    const server = app.listen(PORT, HOST, () => {
      const localIP = getLocalIP();
      console.log(`
  =================================================
  SERVIDOR ONLINE!
  =================================================
  Iniciado em : ${new Date().toLocaleString('pt-BR')}
  Local       : http://localhost:${PORT}
  Expo Go     : http://${localIP}:${PORT} 
  Ambiente    : ${process.env.NODE_ENV || 'development'}
  =================================================
      `);
    });
    const shutdown = async (signal: string) => {
      console.log(`\nSinal ${signal} recebido. Limpando recursos...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log("Servidor e Banco de dados encerrados.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

  } catch (error) {
    console.error("Falha na inicialização:", error);
    process.exit(1);
  }
}

startServer();