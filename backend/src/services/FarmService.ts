import { PrismaClient, UserFarmItem, StoreItem } from "@prisma/client";

const prisma = new PrismaClient();

// --- CONFIGURAÇÃO DO JOGO BASICO (Centralizada no Service) ---
export const GAME_CONFIG = {
  IDS: {
    EGG: 21, 
    WHEAT_SACK: 22, 
  },
  REWARDS: {
    ANIMAL_XP: 5,
    PLANT_XP: 15,
  },
  TIMERS: {
    ANIMAL_PRODUCTION_SECONDS: 300, // 5 Minutos
    PLANT_GROWTH_SECONDS: 15,
  },
  LIMITS: {
    FARM_SLOTS: 9,
    MAX_CHICKENS: 6,
  }
};

type FarmItemWithDetails = UserFarmItem & { item: StoreItem };

export const FarmService = {

  // ==========================================
  // SISTEMA DE LEVEL UP
  // ==========================================
  getLevelCap(level: number) {
    return Math.floor(100 * Math.pow(1.65, level - 1));
  },

  calculateLevelUp(currentXp: number, currentLevel: number, xpToAdd: number) {
    let xp = currentXp + xpToAdd;
    let level = currentLevel;
    let xpCap = this.getLevelCap(level);
    let leveledUp = false;

    while (xp >= xpCap) {
      xp -= xpCap;
      level++;
      xpCap = this.getLevelCap(level);
      leveledUp = true;
    }

    return { xp, level, leveledUp };
  },

  // ==========================================
  // LOJA
  // ==========================================
  async getShopItems() {
    return await prisma.storeItem.findMany({
      where: {
        category: { in: ['plant', 'animal', 'building', 'consumable'] },
        price: { gt: 0 }
      },
      orderBy: { price: 'asc' }
    });
  },

  async checkDependency(userId: number, dependencyId: number | null, tx: any = prisma): Promise<void> {
    if (!dependencyId) return;
    const hasBuilding = await tx.userFarmItem.findFirst({ where: { userId, itemId: dependencyId } });
    if (!hasBuilding) throw new Error(`Bloqueado: Estrutura necessária não encontrada na sua fazenda.`);
  },

  async checkItemLimit(userId: number, itemId: number, maxQuantity: number | null, tx: any = prisma): Promise<void> {
    if (maxQuantity === null) return;
    const currentCount = await tx.userFarmItem.count({ where: { userId, itemId } });
    if (currentCount >= maxQuantity) throw new Error(`Limite atingido! Máximo: ${maxQuantity} unidades.`);
  },

  async buyItem(userId: number, itemId: number, quantity: number = 1) {
    if (!quantity || quantity <= 0) throw new Error("Quantidade inválida.");

    return await prisma.$transaction(async (tx) => {
      const item = await tx.storeItem.findUnique({ where: { id: itemId } });
      const user = await tx.user.findUnique({ where: { id: userId } });

      if (!item || !user) throw new Error("Dados não encontrados.");
      if (item.price <= 0) throw new Error("Este item não está disponível para compra.");
      
      if (user.level < item.unlockLevel) throw new Error(`Requer Nível ${item.unlockLevel}.`);
      
      if (user.completedActivities < item.requiredActivities) {
        throw new Error(`Complete mais ${item.requiredActivities - user.completedActivities} atividade(s) para liberar.`);
      }

      const totalCost = item.price * quantity;
      
      if (user.coins < totalCost) throw new Error("Saldo insuficiente!");

      await this.checkItemLimit(userId, itemId, item.maxQuantity, tx);
      await this.checkDependency(userId, item.requiresBuildingId, tx);

      await tx.user.update({
        where: { id: userId },
        data: { coins: { decrement: totalCost } }
      });

      if (item.category === 'building') {
        return await tx.userFarmItem.create({ data: { userId, itemId, level: 1 } });
      } else {
        return await tx.userResource.upsert({
          where: { userId_itemId: { userId, itemId } },
          update: { quantity: { increment: quantity } },
          create: { userId, itemId, quantity }
        });
      }
    });
  },

  // ==========================================
  // FAZENDA
  // ==========================================

  async getDashboard(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        farmItems: { include: { item: true } },
        resources: { include: { item: true } }
      }
    });

    if (!user) throw new Error("Usuário não encontrado");

    const farmMapped = user.farmItems.map(f => {
      const now = new Date().getTime();
      const lastAction = f.lastFed ? new Date(f.lastFed).getTime() : new Date(f.createdAt).getTime();
      
      const growthTimeSeconds = f.item.category === 'animal' 
        ? GAME_CONFIG.TIMERS.ANIMAL_PRODUCTION_SECONDS 
        : (f.item.growthTime ? f.item.growthTime * 60 : GAME_CONFIG.TIMERS.PLANT_GROWTH_SECONDS);
      
      const isReady = growthTimeSeconds === 0 || now >= (lastAction + (growthTimeSeconds * 1000));

      return {
        id: f.id,
        itemId: f.itemId,
        name: f.item.name,
        category: f.item.category,
        icon: f.item.icon,
        status: isReady ? "ready" : "growing",
        lastFed: f.lastFed,
        createdAt: f.createdAt,
        growthTimeSeconds: growthTimeSeconds
      };
    });

    return {
      stats: { 
        nome: user.name, 
        moedas: user.coins, 
        nivel: user.level, 
        xp: user.xp, 
        atividadesConcluidas: user.completedActivities, 
        maxStorage: user.maxStorage, 
        now: Date.now() 
      },
      config: { animalTime: GAME_CONFIG.TIMERS.ANIMAL_PRODUCTION_SECONDS, plantTime: GAME_CONFIG.TIMERS.PLANT_GROWTH_SECONDS },
      farm: farmMapped,
      warehouse: user.resources.map(r => ({ 
        itemId: r.itemId, 
        name: r.item.name, 
        quantity: r.quantity, 
        sellPrice: r.item.sellPrice, 
        category: r.item.category,
        icon: r.item.icon 
      }))
    };
  },

  async collectAnimal(userId: number, farmItemId: number) {
    const animal = await prisma.userFarmItem.findFirst({ where: { id: farmItemId, userId } });
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { resources: true } });

    if (!animal || !user) throw new Error("Animal não encontrado na sua fazenda.");

    const now = new Date();
    const lastAction = animal.lastFed || animal.createdAt;
    const secondsPassed = (now.getTime() - new Date(lastAction).getTime()) / 1000;

    if (secondsPassed < GAME_CONFIG.TIMERS.ANIMAL_PRODUCTION_SECONDS) {
      throw new Error(`Ainda não produziu! Faltam ${Math.ceil(GAME_CONFIG.TIMERS.ANIMAL_PRODUCTION_SECONDS - secondsPassed)}s.`);
    }

    const currentStorage = user.resources.reduce((acc, res) => acc + res.quantity, 0);
    if (currentStorage >= user.maxStorage) throw new Error("Seu armazém está cheio!");

    const eggItem = await prisma.storeItem.findFirst({ where: { icon: 'egg_icon' } });
    const realEggId = eggItem ? eggItem.id : GAME_CONFIG.IDS.EGG; 

    if (!eggItem) {
        console.warn("⚠️ AVISO: Item 'egg_icon' não encontrado no banco. Usando fallback.");
    }

    return await prisma.$transaction(async (tx) => {
      await tx.userFarmItem.update({ where: { id: farmItemId }, data: { lastFed: now } });
      
      await tx.userResource.upsert({
        where: { userId_itemId: { userId, itemId: realEggId } },
        update: { quantity: { increment: 1 } },
        create: { userId, itemId: realEggId, quantity: 1 }
      });

      const { xp, level, leveledUp } = this.calculateLevelUp(user.xp, user.level, GAME_CONFIG.REWARDS.ANIMAL_XP);
      await tx.user.update({ where: { id: userId }, data: { xp, level } });

      return { leveledUp, newLevel: level, message: "Ovo colhido! +5 XP" };
    });
  },

  async collectAllAnimals(userId: number, farmItemIds: number[]) {
    if (!farmItemIds.length) throw new Error("Nenhum animal selecionado.");

    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId }, include: { resources: true } });
      if (!user) throw new Error("Usuário não encontrado.");

      let totalXpToGain = 0;
      let totalEggsToGain = 0;

      for (const id of farmItemIds) {
        const animal = await tx.userFarmItem.findFirst({ where: { id, userId } });
        if (!animal) continue;

        const lastAction = animal.lastFed || animal.createdAt;
        const secondsPassed = (new Date().getTime() - new Date(lastAction).getTime()) / 1000;

        if (secondsPassed >= GAME_CONFIG.TIMERS.ANIMAL_PRODUCTION_SECONDS) {
          totalXpToGain += GAME_CONFIG.REWARDS.ANIMAL_XP;
          totalEggsToGain += 1;
          await tx.userFarmItem.update({ where: { id }, data: { lastFed: new Date() } });
        }
      }

      if (totalEggsToGain === 0) throw new Error("Nada para colher ainda!");

      const eggItem = await tx.storeItem.findFirst({ where: { icon: 'egg_icon' } });
      const realEggId = eggItem ? eggItem.id : GAME_CONFIG.IDS.EGG;

      await tx.userResource.upsert({
        where: { userId_itemId: { userId, itemId: realEggId } },
        update: { quantity: { increment: totalEggsToGain } },
        create: { userId: userId, itemId: realEggId, quantity: totalEggsToGain }
      });

      const { xp, level, leveledUp } = this.calculateLevelUp(user.xp, user.level, totalXpToGain);
      await tx.user.update({ where: { id: userId }, data: { xp, level } });

      return { leveledUp, newLevel: level, message: `${totalEggsToGain} ovos colhidos! +${totalXpToGain} XP` };
    });
  },

  async collectPlant(userId: number, farmItemId: number) {
    const plant = await prisma.userFarmItem.findFirst({ where: { id: farmItemId, userId }, include: { item: true } });
    if (!plant || plant.item.category !== 'plant') throw new Error("Plantação inválida ou não pertence a você.");

    const now = new Date();
    const elapsed = (now.getTime() - new Date(plant.createdAt).getTime()) / 1000;
    const requiredTime = plant.item.growthTime ? plant.item.growthTime * 60 : GAME_CONFIG.TIMERS.PLANT_GROWTH_SECONDS;

    if (elapsed < requiredTime) throw new Error("A planta ainda está crescendo!");

    const producedItemName = plant.item.produces;
    if (!producedItemName) throw new Error("Esta planta não produz nada.");

    const producedItem = await prisma.storeItem.findFirst({ where: { name: producedItemName } });
    if (!producedItem) throw new Error(`Erro no sistema: O item '${producedItemName}' não existe no banco.`);

    return await prisma.$transaction(async (tx) => {
      await tx.userFarmItem.delete({ where: { id: farmItemId } });

      await tx.userResource.upsert({
        where: { userId_itemId: { userId, itemId: producedItem.id } },
        update: { quantity: { increment: 1 } },
        create: { userId, itemId: producedItem.id, quantity: 1 }
      });

      const user = await tx.user.findUnique({ where: { id: userId } });
      
      const { xp, level, leveledUp } = this.calculateLevelUp(user!.xp, user!.level, GAME_CONFIG.REWARDS.PLANT_XP);
      await tx.user.update({ where: { id: userId }, data: { xp, level } });

      return { leveledUp, newLevel: level, message: `Colheita de ${producedItem.name} realizada! +15 XP` };
    });
  },

  async plantItem(userId: number, itemId: number, quantity: number) {
    if (quantity <= 0) throw new Error("Quantidade inválida.");

    const item = await prisma.storeItem.findUnique({ where: { id: itemId } });
    const userRes = await prisma.userResource.findUnique({ where: { userId_itemId: { userId, itemId } } });
    
    if (!item || !['plant', 'animal'].includes(item.category)) throw new Error("Item inválido para plantio/criação.");
    if (!userRes || userRes.quantity < quantity) throw new Error("Você não tem esse item no estoque.");

    const ocupados = await prisma.userFarmItem.count({ where: { userId, item: { category: item.category } } });
    if (item.category === 'plant' && (ocupados + quantity > GAME_CONFIG.LIMITS.FARM_SLOTS)) {
      throw new Error("Sem espaço nas suas terras!");
    }

    await prisma.$transaction(async (tx) => {
      if (userRes.quantity === quantity) {
        await tx.userResource.delete({ where: { userId_itemId: { userId, itemId } } });
      } else {
        await tx.userResource.update({ where: { userId_itemId: { userId, itemId } }, data: { quantity: { decrement: quantity } } });
      }

      const promises = Array.from({ length: quantity }).map(() => 
        tx.userFarmItem.create({ data: { userId, itemId, createdAt: new Date(), level: 1 } })
      );
      await Promise.all(promises);
    });

    return { message: `${quantity} ${item.name} adicionado(s) com sucesso!` };
  },

  async sellItem(userId: number, itemId: number, quantity: number) {
    if (quantity <= 0) throw new Error("Você não pode vender zero ou quantidades negativas.");

    const item = await prisma.storeItem.findUnique({ where: { id: itemId } });
    const userRes = await prisma.userResource.findUnique({ where: { userId_itemId: { userId, itemId } } });

    if (!userRes || userRes.quantity < quantity) throw new Error("Você não tem essa quantidade no armazém.");
    if (!item || (item.sellPrice ?? 0) <= 0) throw new Error("Este item não pode ser vendido.");

    const earnings = (item.sellPrice ?? 0) * quantity;

    await prisma.$transaction(async (tx) => {
      if (userRes.quantity === quantity) {
        await tx.userResource.delete({ where: { userId_itemId: { userId, itemId } } });
      } else {
        await tx.userResource.update({ where: { userId_itemId: { userId, itemId } }, data: { quantity: { decrement: quantity } } });
      }
      

      await tx.user.update({ where: { id: userId }, data: { coins: { increment: earnings } } });
    });

    return { message: `Vendido! +${earnings} moedas`, earnings };
  }
};