import { Router, Request, Response } from "express";
import prisma from "../prisma"; 
import { authMiddleware } from "../middleware/authMiddleware";
import { ActivityService } from "../services/ActivityService";

const router = Router();
router.use(authMiddleware);

// ==========================================
// LISTAR ATIVIDADES (Com paginação e status)
// ==========================================
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { limit = "10", page = "1" } = req.query;
    
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const [posts, total] = await prisma.$transaction([
      prisma.post.findMany({
        take,
        skip,
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { name: true } },
          quizAttempts: {
            where: { userId },
            take: 1,
            select: { score: true }
          }
        }
      }),
      prisma.post.count()
    ]);

    const formattedPosts = posts.map(post => ({
      ...post,
      authorName: post.author.name, 
      completed: post.quizAttempts.length > 0,
      lastScore: post.quizAttempts.length > 0 ? post.quizAttempts[0].score : null
    }));

    res.json({ data: formattedPosts, total });
  } catch (error) {
    console.error("Erro ao listar atividades:", error);
    res.status(500).json({ error: "Erro ao buscar atividades." });
  }
});

// ==========================================
// CRIAR NOVA ATIVIDADE (Apenas Professor/Admin)
// ==========================================
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, questions } = req.body;
    const { id: userId, role: userRole } = req.user!;

    if (userRole !== "professor" && userRole !== "admin") {
      res.status(403).json({ error: "Acesso negado. Apenas professores podem criar conteúdos." });
      return;
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userId,
        questions: {
          create: questions?.map((q: any) => ({
            text: q.text,
            options: {
              create: q.options.map((o: any) => ({
                text: o.text,
                isCorrect: o.isCorrect
              }))
            }
          }))
        }
      }
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Erro ao criar atividade:", error);
    res.status(500).json({ error: "Erro interno ao salvar atividade." });
  }
});

// ==========================================
// DETALHES DA ATIVIDADE (Comrecompensas)
// ==========================================
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = Number(req.params.id);
    const userId = req.user!.id;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: { select: { name: true } },
        questions: { 
          include: { 
            options: { select: { id: true, text: true, isCorrect: true } } 
          } 
        },
        quizAttempts: { 
          where: { userId },
          orderBy: { createdAt: 'asc' }
        },
      }
    });

    if (!post) {
      res.status(404).json({ error: "Atividade não encontrada." });
      return;
    }

    let pendingReward = null;
    let bestScoreSoFar = 0;

    for (const attempt of post.quizAttempts) {
      if (attempt.score > bestScoreSoFar) {
        const diff = attempt.score - bestScoreSoFar;
        if (!attempt.rewardClaimed) {
          pendingReward = {
            attemptId: attempt.id,
            potentialXp: diff * 50,
            potentialCoins: diff * 10
          };
        }
        bestScoreSoFar = attempt.score;
      }
    }

    res.json({
      ...post,
      authorName: post.author.name,
      quizAttempts: undefined, 
      attemptsCount: post.quizAttempts.length, 
      bestScore: bestScoreSoFar,
      maxAttempts: 2,
      unclaimedReward: pendingReward 
    });
  } catch (error) {
    console.error("Erro ao buscar detalhes:", error);
    res.status(500).json({ error: "Erro ao processar detalhes da atividade." });
  }
});

// ==========================================
// FINALIZAR ATIVIDADE (Usa o ActivityService)
// ==========================================
router.post("/:id/finish", async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await ActivityService.finishActivity(
      req.user!.id, 
      Number(req.params.id), 
      Number(req.body.score)
    );
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Erro ao finalizar atividade." });
  }
});

// ==========================================
// DELETAR ATIVIDADE
// ==========================================
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = Number(req.params.id);
    const { id: userId, role: userRole } = req.user!;

    const post = await prisma.post.findUnique({ 
      where: { id: postId },
      select: { authorId: true, author: { select: { name: true } } }
    });
    
    if (!post) {
      res.status(404).json({ error: "Atividade não encontrada." });
      return;
    }

    //Apenas o autor ou um administrador pode deletar
    if (post.authorId !== userId && userRole !== 'admin') {
      res.status(403).json({ 
        error: `Permissão negada. Esta atividade pertence ao Prof. ${post.author.name}.` 
      });
      return;
    }

    await prisma.post.delete({ where: { id: postId } });
    res.json({ message: "Atividade removida com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar:", error);
    res.status(500).json({ error: "Erro interno ao excluir atividade." });
  }
});

export default router;