import { Router, Request, Response } from "express";
import { FarmService } from "../services/FarmService";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
router.use(authMiddleware);

// ==========================================
// DASHBOARD
// ==========================================
router.get("/dashboard", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id; 
    const dashboardData = await FarmService.getDashboard(userId);
    
    res.json(dashboardData);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Erro ao carregar dashboard." });
  }
});

// ==========================================
// COLETA DE ANIMAL ÚNICO
// ==========================================
router.post('/collect-animal', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const farmItemId = Number(req.body.farmItemId);

    if (!farmItemId || isNaN(farmItemId)) {
      res.status(400).json({ error: "ID do animal é inválido." });
      return;
    }

    const result = await FarmService.collectAnimal(userId, farmItemId);
    
    const message = result.leveledUp 
      ? `Level Up! Nível ${result.newLevel}! ` 
      : result.message;

    res.json({ success: true, message, leveledUp: result.leveledUp, newLevel: result.newLevel });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Erro na coleta." });
  }
});

// ==========================================
// COLETA EM MASSA (GALINHEIRO)
// ==========================================
router.post('/collect-all-animals', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { farmItemIds } = req.body;

    if (!Array.isArray(farmItemIds) || farmItemIds.length === 0) {
      res.status(400).json({ error: "Lista de IDs inválida." });
      return;
    }

    const result = await FarmService.collectAllAnimals(userId, farmItemIds);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Erro na coleta em massa." });
  }
});

// ==========================================
// COLETA DE PLANTAÇÃO
// ==========================================
router.post('/collect-plant', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const farmItemId = Number(req.body.farmItemId);

    if (!farmItemId || isNaN(farmItemId)) {
      res.status(400).json({ error: "ID da plantação inválido." });
      return;
    }

    const result = await FarmService.collectPlant(userId, farmItemId);
    
    const message = result.leveledUp 
      ? `Level Up! Nível ${result.newLevel} alcançado!` 
      : result.message;

    res.json({ success: true, message, leveledUp: result.leveledUp, newLevel: result.newLevel });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Erro na colheita." });
  }
});

// ==========================================
// PLANTAR / ALOCAR NO TERRENO
// ==========================================
router.post('/plant', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const itemId = Number(req.body.itemId);
    const quantity = Number(req.body.quantity) || 1; 

    if (!itemId || isNaN(itemId)) {
      res.status(400).json({ error: "ID do item inválido." });
      return;
    }

    const result = await FarmService.plantItem(userId, itemId, quantity);
    res.json({ success: true, message: result.message });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Erro ao plantar." });
  }
});

// ==========================================
// VENDER RECURSO (ARMAZÉM)
// ==========================================
router.post('/sell', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const itemId = Number(req.body.itemId);
    const quantity = Number(req.body.quantity) || 1;

    if (!itemId || isNaN(itemId)) {
      res.status(400).json({ error: "ID do item inválido." });
      return;
    }

    const result = await FarmService.sellItem(userId, itemId, quantity);
    res.json({ success: true, message: result.message, earnings: result.earnings });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Erro na venda." });
  }
});

export default router;