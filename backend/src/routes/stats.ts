import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { StatsService } from "../services/StatsService";

const router = Router();
router.use(authMiddleware);

// ==========================================
// ESTATÍSTICAS DO DASHBOARD
// ==========================================
router.get("/dashboard", async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = req.user?.role;

    if (userRole !== "professor" && userRole !== "admin") {
      res.status(403).json({ error: "Acesso negado. Área restrita a educadores." });
      return;
    }

    const stats = await StatsService.getDashboardStats();
    
    res.json(stats);
  } catch (error) {
    console.error("Erro na rota de stats:", error);
    res.status(500).json({ error: "Erro interno ao carregar o painel de estatísticas." });
  }
});

export default router;