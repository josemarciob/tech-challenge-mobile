import { Router, Response } from "express";
import prisma from "../prisma"; // Ajuste o caminho se seu arquivo prisma estiver em outro lugar
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware"; 

const router = Router();

//LISTAR USUÁRIOS ---
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: { 
            id: true, 
            name: true, 
            email: true, 
            role: true, 
            xp: true, 
            nivel: true,
            moedas: true
        }, 
      }),
      prisma.user.count(),
    ]);

    res.json({
      page,
      limit,
      total,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

//OBTER PERFIL ÚNICO (XP, MOEDAS, NÍVEL) ---
router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  const userId = Number(req.params.id);
  const requesterId = req.user?.id;

  if (userId !== requesterId && req.user?.role !== 'professor' && req.user?.role !== 'admin') { 
    return res.status(403).json({ error: "Acesso negado." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        xp: true,     
        moedas: true, 
        nivel: true    
      }
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    return res.json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});

//ATUALIZAR USUÁRIO ---
router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  // Verificar se quem está editando é o próprio usuário ou Admin
  if (Number(id) !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ error: "Sem permissão para editar este usuário." });
  }

  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email, role },
      select: { id: true, name: true, email: true, role: true },
    });

    res.json(user);
  } catch (error) {
    res.status(404).json({ error: "Usuário não encontrado ou erro na atualização" });
  }
});

//DELETAR USUÁRIO ---
router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const targetId = Number(id);
  const requesterId = req.user?.id;

  //Validar Permissão de Admin/Professor
  if (req.user?.role !== 'admin' && req.user?.role !== 'professor') {
      return res.status(403).json({ error: "Permissão negada." });
  }

  // Impedir auto-exclusão
  if (targetId === requesterId) {
      return res.status(403).json({ error: "Você não pode excluir sua própria conta!" });
  }

  try {
    await prisma.user.delete({ where: { id: targetId } });
    res.json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
});

export default router;