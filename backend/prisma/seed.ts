import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Limpando banco...');
  
  // Limpa tudo
  await prisma.quizAttempt.deleteMany();
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  console.log('👨‍🏫 Criando Usuários...');
  const hashedPassword = await bcrypt.hash('123456', 10);

  // Cria Professor Admin
  await prisma.user.create({
    data: { 
      name: "Prof. Admin", 
      email: "admin@escola.com", 
      password: hashedPassword, 
      role: "professor", 
      xp: 9999,
      moedas: 9999,
      nivel: 99
    }
  });

  // Cria Aluno Teste
  await prisma.user.create({
    data: { 
      name: "Aluno Teste", 
      email: "aluno@escola.com", 
      password: hashedPassword, 
      role: "student", 
      xp: 0,
      moedas: 0,
      nivel: 1
    }
  });

  console.log('✅ Seed Concluída!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });