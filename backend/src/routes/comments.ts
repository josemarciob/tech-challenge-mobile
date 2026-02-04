import { Router, Response } from "express";
import  prisma  from "../prisma";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

//CRIAR COMENTÁRIO ---
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {

  const { text, postId } = req.body;
  const userId = req.user?.id;

  if (!text || !postId) {
    return res.status(400).json({ error: "Texto e ID do post são obrigatórios." });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        text,         
        postId: Number(postId), 
        userId: Number(userId),
      },
      include: {
        user: { select: { name: true } } 
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar comentário." });
  }
});

//LISTAR COMENTÁRIOS DE UM POST ---
router.get("/:postId", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { postId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { postId: Number(postId) }, 
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } }
      }
    });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar comentários." });
  }
});

//DELETAR COMENTÁRIO ---
router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: Number(id) }
    });

    if (!comment) return res.status(404).json({ error: "Comentário não encontrado." });

    if (comment.userId !== userId && req.user?.role !== 'professor' && req.user?.role !== 'admin') {
      return res.status(403).json({ error: "Sem permissão." });
    }

    await prisma.comment.delete({ where: { id: Number(id) } });

    res.json({ message: "Comentário deletado." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar comentário." });
  }
});

export default router;