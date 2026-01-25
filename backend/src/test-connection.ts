import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  try {
    // Testa a conexão
    await prisma.$connect()
    console.log('Conectado ao banco de dados!')
    
    // Tenta uma query simples
    const users = await prisma.user.findMany()
    console.log(`Total de usuários: ${users.length}`)
    
    // Mostra as tabelas disponíveis
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log('Tabelas disponíveis:', tables)
    
  } catch (error) {
    console.error('Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()