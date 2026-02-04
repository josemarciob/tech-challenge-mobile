import { Router } from "express";
import prisma from "../prisma";

const router = Router();

router.get("/dashboard", async (req, res) => {
  try {
    
    const [totalAlunos, totalPosts] = await Promise.all([
      
      prisma.user.count({ where: { role: "aluno" } }),
      
      prisma.post.count(), 
    ]);

    res.json({
      alunos: totalAlunos,
      atividades: totalPosts, 
      engajamento: { taxa: 0, totalEssaSemana: 0 } 
    });
  } catch (error) {
    console.error("Erro stats:", error);
    res.status(500).json({ error: "Erro" });
  }
});

export default router;