import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { UserService } from "../services/UserService";

const router = Router();
router.use(authMiddleware);

// ==========================================
// LISTAR USUÁRIOS
// ==========================================
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { users, total } = await UserService.listUsers(page, limit);

    res.json({ page, limit, total, data: users });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários." });
  }
});

// ==========================================
// PERFIL
// ==========================================
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.id);
    const requester = req.user!;

    // Regra: Próprio usuário ou Educadores podem ver
    if (userId !== requester.id && requester.role !== 'professor' && requester.role !== 'admin') { 
      res.status(403).json({ error: "Acesso negado." });
      return;
    }

    const user = await UserService.getUserById(userId);
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar perfil." });
  }
});

// ==========================================
// ATUALIZAR USUÁRIO
// ==========================================
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const targetId = Number(req.params.id);
    const { name, email, role } = req.body;
    const requester = req.user!;

    if (targetId !== requester.id && requester.role !== 'admin') {
      res.status(403).json({ error: "Sem permissão para editar." });
      return;
    }

    const safeRole = (role && requester.role === 'admin') ? role : undefined;

    const user = await UserService.updateUser(targetId, {
      name,
      email: email?.toLowerCase(),
      role: safeRole
    });

    res.json(user);
  } catch (error) {
    res.status(404).json({ error: "Erro na atualização." });
  }
});

// ==========================================
// DELETAR USUÁRIO
// ==========================================
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const targetId = Number(req.params.id);
    const requester = req.user!;

    if (requester.role !== 'admin' && requester.role !== 'professor') {
      res.status(403).json({ error: "Permissão negada." });
      return;
    }

    if (targetId === requester.id) {
      res.status(403).json({ error: "Você não pode se auto-excluir!" });
      return;
    }

    await UserService.deleteUser(targetId);
    res.json({ message: "Usuário removido com sucesso." });
  } catch (error) {
    res.status(404).json({ error: "Usuário não encontrado." });
  }
});

export default router;