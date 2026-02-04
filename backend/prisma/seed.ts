import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Limpando banco...');
  
  await prisma.quizAttempt.deleteMany();
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  console.log('👨‍🏫 Criando Professor...');
  const hashedPassword = await bcrypt.hash('123456', 10);
  

  const professor = await prisma.user.create({
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

  console.log('📚 Criando Atividades (Posts + Quizzes)...');

  // ATIVIDADE DE MATEMÁTICA
  await prisma.post.create({
    data: {
      title: "Matemática (1º Ano): Função Afim - O Caso do Uber",
      content: `O QUE É?
A Função Afim (f(x) = ax + b) serve para calcular valores com uma parte fixa e uma variável.

EXEMPLO PRÁTICO:
Um motorista de aplicativo cobra:
- R$ 5,00 fixos para iniciar a corrida (b).
- R$ 2,00 por quilômetro rodado (a).

A fórmula é: Preço = 2x + 5.
Se você andar 10km: 2*10 + 5 = R$ 25,00.`,
      authorId: professor.id,
      questions: {
        create: [
          {
            text: "No exemplo do Uber (2x + 5), o que significa o número 5?",
            options: {
              create: [
                { text: "A tarifa fixa de partida", isCorrect: true },
                { text: "O preço por km", isCorrect: false },
                { text: "A distância", isCorrect: false },
                { text: "O desconto", isCorrect: false }
              ]
            }
          },
          {
            text: "Quanto custaria uma corrida de 20km?",
            options: {
              create: [
                { text: "R$ 45,00", isCorrect: true }, // 2*20 + 5
                { text: "R$ 40,00", isCorrect: false },
                { text: "R$ 25,00", isCorrect: false },
                { text: "R$ 50,00", isCorrect: false }
              ]
            }
          }
        ]
      }
    }
  });

  //ATIVIDADE DE FÍSICA
  await prisma.post.create({
    data: {
      title: "Física (1º Ano): Velocidade Média",
      content: `CONCEITO:
Velocidade Média é a razão entre a distância percorrida e o tempo gasto. Vm = ΔS / Δt.

EXEMPLO PRÁTICO:
Um ônibus sai de São Paulo e vai para o Rio (400km) e leva 5 horas.
Vm = 400 / 5 = 80 km/h.
Isso não significa que ele ficou a 80km/h o tempo todo, mas foi sua média.`,
      authorId: professor.id,
      questions: {
        create: [
          {
            text: "Se a viagem durasse apenas 4 horas, qual seria a velocidade média?",
            options: {
              create: [
                { text: "100 km/h", isCorrect: true }, // 400 / 4
                { text: "80 km/h", isCorrect: false },
                { text: "120 km/h", isCorrect: false },
                { text: "90 km/h", isCorrect: false }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('✅ Seed Concluído com Sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });