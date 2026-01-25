import { Router } from "express";
import prisma from "../prisma";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// Criar comentário em um post
router.post("/post/:postId", authMiddleware, async (req: AuthRequest, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Conteúdo do comentário é obrigatório" });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        author: req.user!.name,
        postId: Number(postId),
        userId: req.user!.id,
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar comentário no post" });
  }
});

// Criar comentário em uma atividade
router.post("/atividade/:atividadeId", authMiddleware, async (req: AuthRequest, res) => {
  const { atividadeId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Conteúdo do comentário é obrigatório" });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        author: req.user!.name,
        atividadeId: Number(atividadeId),
        userId: req.user!.id,
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar comentário na atividade" });
  }
});

// Listar comentários de um post
router.get("/post/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: Number(postId) },
      orderBy: { createdAt: "desc" },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar comentários do post" });
  }
});

// Listar comentários de uma atividade
router.get("/atividade/:atividadeId", async (req, res) => {
  const { atividadeId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { atividadeId: Number(atividadeId) },
      orderBy: { createdAt: "desc" },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar comentários da atividade" });
  }
});

// Deletar comentário (somente autor)
router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;

  try {
    const existingComment = await prisma.comment.findUnique({ where: { id: Number(id) } });
    if (!existingComment) return res.status(404).json({ error: "Comentário não encontrado" });

    if (existingComment.userId !== req.user!.id) {
      return res.status(403).json({ error: "Você não tem permissão para deletar este comentário" });
    }

    await prisma.comment.delete({ where: { id: Number(id) } });
    res.json({ message: "Comentário deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar comentário" });
  }
});

export default router;
