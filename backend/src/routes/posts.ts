import { Router, Response } from "express";
import  prisma  from "../prisma"; 
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

//LISTAR TODOS OS POSTS (FEED) ---
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { limit, page } = req.query;
  const userId = req.user?.id;

  const take = limit ? Number(limit) : undefined;
  const skip = page && limit ? (Number(page) - 1) * Number(limit) : undefined;

  try {
    const [posts, total] = await prisma.$transaction([
      prisma.post.findMany({
        take,
        skip,
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { name: true } },
          _count: { select: { likes: true, comments: true } },
          quizAttempts: {
            where: { userId: userId },
            take: 1,
            select: { id: true, score: true }
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
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar posts" });
  }
});

//CRIAR NOVO POST (COM QUIZ) ---
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { title, content, questions } = req.body;
  const userId = req.user!.id;

  try {
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
    console.error(error);
    res.status(500).json({ error: "Erro ao criar post" });
  }
});

//DETALHES DO POST (AULA + QUIZ + RECOMPENSAS) ---
router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const userId = req.user?.id;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { name: true } },
        questions: { 
            include: { 
                options: { select: { id: true, text: true, isCorrect: true } } 
            } 
        },
        quizAttempts: { 
            where: { userId: userId },
            orderBy: { createdAt: 'asc' }
        },
        _count: { select: { likes: true, comments: true } }
      }
    });

    if (!post) return res.status(404).json({ error: "Post não encontrado" });

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

    const responseData = {
        ...post,
        authorName: post.author.name,
        quizAttempts: undefined, 
        attemptsCount: post.quizAttempts.length, 
        bestScore: bestScoreSoFar,
        maxAttempts: 2,
        unclaimedReward: pendingReward 
    };

    return res.json(responseData);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar detalhes" });
  }
});

//FINALIZAR ATIVIDADE ---
router.post("/:id/finish", authMiddleware, async (req: AuthRequest, res: Response) => {
  const postId = Number(req.params.id);
  const userId = req.user!.id;
  const { score } = req.body;

  try {
    const previousAttempts = await prisma.quizAttempt.findMany({
        where: { userId, postId },
        orderBy: { score: 'desc' }
    });

    if (previousAttempts.length >= 2) {
        return res.status(403).json({ error: "Limite de tentativas atingido." });
    }

    const previousBestScore = previousAttempts.length > 0 ? previousAttempts[0].score : 0;
    const totalQuestions = await prisma.question.count({ where: { postId } });
    
    if (previousBestScore === totalQuestions) {
        return res.status(403).json({ error: "Atividade já concluída com nota máxima!" });
    }

    let scoreDifference = 0;
    if (score > previousBestScore) {
        scoreDifference = score - previousBestScore;
    }

    const xpEarned = scoreDifference * 50;
    const coinsEarned = scoreDifference * 10;

    //Salva tentativa e atualiza User (se houver ganho)
    const result = await prisma.$transaction(async (tx) => {
        await tx.quizAttempt.create({
            data: { 
                userId, 
                postId, 
                score, 
                rewardClaimed: true 
            }
        });

        const user = await tx.user.findUnique({ where: { id: userId } });
        let newLevel = user!.nivel;
        let leveledUp = false;

        if (xpEarned > 0) {
            const currentXp = user!.xp + xpEarned;
            newLevel = Math.floor(currentXp / 500) + 1;
            leveledUp = newLevel > user!.nivel;

            await tx.user.update({
                where: { id: userId },
                data: { 
                    xp: currentXp, 
                    moedas: user!.moedas + coinsEarned,
                    nivel: newLevel
                }
            });
        }

        return {
            xpEarned,
            coinsEarned,
            leveledUp,
            newLevel,
            attemptsCount: previousAttempts.length + 1
        };
    });

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao finalizar atividade" });
  }
});

//DELETAR POST ---
router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    const userId = req.user!.id;
    const userRole = req.user!.role;

    try {
        const post = await prisma.post.findUnique({ 
            where: { id },
            include: { author: { select: { name: true } } }
        });
        
        if (!post) return res.status(404).json({ error: "Post não encontrado" });

        // Validação: Só Dono ou Admin pode deletar
        if (post.authorId !== userId && userRole !== 'admin') {
            return res.status(403).json({ 
                error: `Esta atividade pertence ao Prof. ${post.author.name} e não pode ser excluída por você.` 
            });
        }

        await prisma.post.delete({ where: { id } });
        res.json({ message: "Post deletado com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao deletar post" });
    }
});

export default router;