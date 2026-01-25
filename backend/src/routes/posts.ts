import { Router } from "express";
import prisma from "../prisma";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// Listar todos os posts
router.get("/", async (_req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { id: true, name: true, role: true } },
        comments: true,
        atividades: true,
      },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar posts" });
  }
});

// Buscar um post específico
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: {
        author: { select: { id: true, name: true, role: true } },
        comments: true,
        atividades: true,
      },
    });
    if (!post) return res.status(404).json({ error: "Post não encontrado" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar post" });
  }
});

// Criar novo post
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Título e conteúdo obrigatórios" });
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: req.user!.id,
      },
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar post" });
  }
});

// Editar post
router.put("/:id", authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Título e conteúdo obrigatórios" });
  }

  try {
    const existingPost = await prisma.post.findUnique({ where: { id: Number(id) } });
    if (!existingPost) return res.status(404).json({ error: "Post não encontrado" });

    if (existingPost.authorId !== req.user!.id) {
      return res.status(403).json({ error: "Você não tem permissão para editar este post" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: { title, content },
    });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar post" });
  }
});

// Deletar post
router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;

  try {
    const existingPost = await prisma.post.findUnique({ where: { id: Number(id) } });
    if (!existingPost) return res.status(404).json({ error: "Post não encontrado" });

    if (existingPost.authorId !== req.user!.id) {
      return res.status(403).json({ error: "Você não tem permissão para deletar este post" });
    }

    await prisma.post.delete({ where: { id: Number(id) } });
    res.json({ message: "Post deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar post" });
  }
});

export default router;
