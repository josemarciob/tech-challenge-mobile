import { Router, Request, Response } from "express";
import { FarmService } from "../services/FarmService"; 
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
router.use(authMiddleware);

// ==========================================
// CATÁLOGO DA LOJA
// ==========================================
router.get("/items", async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await FarmService.getShopItems();
    res.json(items);
  } catch (error) {
    console.error("Erro ao carregar a loja:", error);
    res.status(500).json({ error: "Erro interno ao carregar o catálogo da loja." });
  }
});

// ==========================================
// COMPRAR ITEM 
// ==========================================
router.post("/buy", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id; 
    
    const itemId = Number(req.body.itemId);
    const quantity = Number(req.body.quantity) || 1;

    // Validações básicas
    if (!itemId || isNaN(itemId)) {
      res.status(400).json({ error: "ID do item é inválido ou obrigatório." });
      return;
    }

    if (quantity <= 0 || isNaN(quantity)) {
      res.status(400).json({ error: "Quantidade inválida." });
      return;
    }

    // (verificar saldo, estoque, nível)
    await FarmService.buyItem(userId, itemId, quantity);

    res.status(201).json({
      success: true,
      message: "Compra realizada com sucesso!"
    });

  } catch (error: any) {
    res.status(400).json({ error: error.message || "Erro inesperado na compra." });
  }
});

export default router;