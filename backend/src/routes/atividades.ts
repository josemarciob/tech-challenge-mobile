import { Router } from "express";
import prisma from "../prisma";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// Listar todas as atividades
router.get("/", async (_req, res) => {
  try {
    const atividades = await prisma.atividade.findMany({
      include: {
        author: { select: { id: true, name: true, role: true } },
        comments: true,
        questoes: true,
      },
    });
    res.json(atividades);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar atividades" });
  }
});

// Buscar uma atividade específica
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const atividade = await prisma.atividade.findUnique({
      where: { id: Number(id) },
      include: {
        author: { select: { id: true, name: true, role: true } },
        comments: true,
        questoes: true,
      },
    });
    if (!atividade) return res.status(404).json({ error: "Atividade não encontrada" });
    res.json(atividade);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar atividade" });
  }
});

// Criar nova atividade
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  const { title, description, content, postId } = req.body;

  if (!title || !content || !postId) {
    return res.status(400).json({ error: "Título, conteúdo e postId são obrigatórios" });
  }

  try {
    const atividade = await prisma.atividade.create({
      data: {
        title,
        description,
        content,
        authorId: req.user!.id,
        postId: Number(postId),
      },
    });

    res.status(201).json(atividade);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar atividade" });
  }
});

// Editar atividade
router.put("/:id", authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { title, description, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Título e conteúdo obrigatórios" });
  }

  try {
    const existingAtividade = await prisma.atividade.findUnique({ where: { id: Number(id) } });
    if (!existingAtividade) return res.status(404).json({ error: "Atividade não encontrada" });

    if (existingAtividade.authorId !== req.user!.id) {
      return res.status(403).json({ error: "Você não tem permissão para editar esta atividade" });
    }

    const updatedAtividade = await prisma.atividade.update({
      where: { id: Number(id) },
      data: { title, description, content },
    });

    res.json(updatedAtividade);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar atividade" });
  }
});

// Deletar atividade
router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;

  try {
    const existingAtividade = await prisma.atividade.findUnique({ where: { id: Number(id) } });
    if (!existingAtividade) return res.status(404).json({ error: "Atividade não encontrada" });

    if (existingAtividade.authorId !== req.user!.id) {
      return res.status(403).json({ error: "Você não tem permissão para deletar esta atividade" });
    }

    await prisma.atividade.delete({ where: { id: Number(id) } });
    res.json({ message: "Atividade deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar atividade" });
  }
});

export default router;
