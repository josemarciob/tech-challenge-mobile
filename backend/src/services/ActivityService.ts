import prisma from "../prisma";
import { FarmService } from "./FarmService";

export class ActivityService {
  static async finishActivity(userId: number, postId: number, score: number) {
    //Validações
    const previousAttempts = await prisma.quizAttempt.findMany({
      where: { userId, postId },
      orderBy: { score: 'desc' }
    });

    if (previousAttempts.length >= 2) throw new Error("Limite de tentativas atingido.");

    const previousBestScore = previousAttempts.length > 0 ? previousAttempts[0].score : 0;
    const totalQuestions = await prisma.question.count({ where: { postId } });
    
    if (previousBestScore === totalQuestions) throw new Error("Atividade já concluída com nota máxima!");

    //Cálculo de Recompensas
    let scoreDifference = Math.max(0, score - previousBestScore);
    const xpEarned = scoreDifference * 50;
    const coinsEarned = scoreDifference * 10;

    return await prisma.$transaction(async (tx) => {
      await tx.quizAttempt.create({
        data: { userId, postId, score, rewardClaimed: true }
      });

      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("Usuário não encontrado.");

      let levelData = { level: user.level, xp: user.xp, leveledUp: false };

      if (xpEarned > 0) {
        levelData = FarmService.calculateLevelUp(user.xp, user.level, xpEarned);
        
        await tx.user.update({
          where: { id: userId },
          data: { 
            xp: levelData.xp, 
            coins: user.coins + coinsEarned, 
            level: levelData.level,                
            completedActivities: { increment: 1 } 
          }
        });
      }

      return {
        xpEarned,
        coinsEarned,
        leveledUp: levelData.leveledUp,
        newLevel: levelData.level,
        attemptsCount: previousAttempts.length + 1
      };
    });
  }

}