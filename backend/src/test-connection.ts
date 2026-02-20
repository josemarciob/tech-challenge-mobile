import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL não configurada no .env");
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando teste de conexão...');

  try {
    await prisma.$connect();
    console.log('Conexão com o banco de dados estabelecida com sucesso!\n');

    const totalUsers = await prisma.user.count();
    console.log(`Total de usuários cadastrados: ${totalUsers}`);

    type TableResult = { table_name: string };
    
    const tables = await prisma.$queryRaw<TableResult[]>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    console.log('\nTabelas disponíveis no banco de dados:');
    
    const tableNames = tables.map(t => t.table_name);
    console.table(tableNames);

    console.log('\nTeste finalizado sem erros!');

  } catch (error) {
    console.error('\nErro durante o teste de conexão:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('Conexão encerrada.');
  }
}

main();