import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ====================================================
// DADOS INICIAIS PARA SEED
// ====================================================

const USERS = [
  { 
    name: "Prof. Admin", 
    email: "admin@escola.com", 
    role: "professor", 
    xp: 9999, 
    coins: 99999,              
    level: 99,               
    completedActivities: 100 
  },
  { 
    name: "Aluno Teste", 
    email: "aluno@escola.com", 
    role: "student", 
    xp: 0, 
    coins: 1000, 
    level: 1, 
    completedActivities: 0 
  }
];

const BUILDINGS = [
  { name: "Galinheiro Simples", description: "Um abrigo básico para suas galinhas.", price: 500, sellPrice: 0, category: "building", icon: "coop", unlockLevel: 2, maxQuantity: 1, growthTime: 0, requiredActivities: 2 },
  { name: "Celeiro Grande", description: "Espaço amplo para vacas e animais grandes.", price: 2500, sellPrice: 0, category: "building", icon: "barn", unlockLevel: 5, maxQuantity: 1, growthTime: 0, requiredActivities: 5 }
];

const ANIMALS = [
  { name: "Galinha Poedeira", description: "Produz ovos frescos a cada ciclo.", price: 50, sellPrice: 20, category: "animal", icon: "chicken", produces: "Ovo Fresco", productionRate: 1, growthTime: 5, unlockLevel: 2, maxQuantity: null, requiresBuildingName: "Galinheiro Simples", requiredActivities: 1 },
  { name: "Vaca Malhada", description: "Produz leite de alta qualidade.", price: 1200, sellPrice: 500, category: "animal", icon: "cow", produces: "Leite", productionRate: 1, growthTime: 10, unlockLevel: 5, maxQuantity: null, requiresBuildingName: "Celeiro Grande", requiredActivities: 5 }
];

const PLANTS = [
  { name: "Semente de Trigo", description: "Cresce rápido e é fácil de cuidar.", price: 10, sellPrice: 0, category: "plant", icon: "wheat", produces: "Saca de Trigo", productionRate: 1, growthTime: 1, unlockLevel: 1, maxQuantity: null, requiredActivities: 0 },
  { name: "Semente de Milho", description: "Demora um pouco mais, mas vale a pena.", price: 30, sellPrice: 0, category: "plant", icon: "corn", produces: "Milho", productionRate: 1, growthTime: 3, unlockLevel: 2, maxQuantity: null, requiredActivities: 0 },
  { name: "Semente de Abóbora", description: "Gigante e valiosa.", price: 80, sellPrice: 0, category: "plant", icon: "pumpkin", produces: "Abóbora", productionRate: 1, growthTime: 5, unlockLevel: 4, maxQuantity: null, requiredActivities: 3 }
];

const CONSUMABLES = [
  { name: "Ração de Aves", description: "Comida essencial para galinhas produzirem.", price: 5, sellPrice: 2, category: "consumable", icon: "feed_chicken", unlockLevel: 2, maxQuantity: null }
];

const RESOURCES = [
  { name: "Ovo Fresco", description: "Um ovo orgânico direto da galinha.", price: 0, sellPrice: 10, category: "resource", icon: "egg_icon", unlockLevel: 1, maxQuantity: null },
  { name: "Saca de Trigo", description: "Trigo moído pronto para venda.", price: 0, sellPrice: 25, category: "resource", icon: "wheat_icon", unlockLevel: 1, maxQuantity: null },
  { name: "Milho", description: "Espiga de milho fresquinha.", price: 0, sellPrice: 50, category: "resource", icon: "corn_icon", unlockLevel: 2, maxQuantity: null },
  { name: "Abóbora", description: "Uma abóbora gigante e valiosa.", price: 0, sellPrice: 150, category: "resource", icon: "pumpkin_harvested", unlockLevel: 4, maxQuantity: null }
];

// ====================================================
// SEED
// ====================================================

async function main() {
  console.log('1. Limpando banco de dados...');
  // não mudar a ordem de deletar
  await prisma.userResource.deleteMany();
  await prisma.userFarmItem.deleteMany();
  await prisma.storeItem.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  console.log('2. Criando Usuários...');
  const hashedPassword = await bcrypt.hash('123456', 10);
  for (const user of USERS) {
    await prisma.user.create({ data: { ...user, password: hashedPassword } });
  }

  console.log('3. Semeando Edifícios...');
  const allItemsMap: Record<string, number> = {};

  for (const building of BUILDINGS) {
    const created = await prisma.storeItem.create({ data: building });
    allItemsMap[created.name] = created.id;
  }

  console.log('4. Semeando Animais...');
  for (const animal of ANIMALS) {
    const { requiresBuildingName, ...animalData } = animal;
    
    if (!allItemsMap[requiresBuildingName]) {
      throw new Error(`Edifício '${requiresBuildingName}' não encontrado.`);
    }

    const created = await prisma.storeItem.create({
      data: {
        ...animalData,
        requiresBuildingId: allItemsMap[requiresBuildingName]
      }
    });
    allItemsMap[created.name] = created.id;
  }

  console.log('5. Semeando Plantas e Recursos...');
  const remainingItems = [...PLANTS, ...CONSUMABLES, ...RESOURCES];
  for (const item of remainingItems) {
    const created = await prisma.storeItem.create({ data: item });
    allItemsMap[created.name] = created.id;
  }

  console.log('\n✅ SEED FINALIZADA COM SUCESSO!');
  console.table(allItemsMap); 
}

main()
  .catch((e) => {
    console.error("Erro durante o Seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });