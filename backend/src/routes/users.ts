import { Router } from "express";
import prisma from "../prisma";

const router = Router();

// Listar usuários com paginação
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: { id: true, name: true, email: true, role: true, xp: true, nivel: true, moedas: true, conquistas: true }, // não expõe senha
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
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

// Atualizar usuário
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email, role },
      select: { id: true, name: true, email: true, role: true },
    });

    res.json(user);
  } catch (error) {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
});

// Deletar usuário
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
});

export default router;
