import prisma from "../prisma";

export class StatsService {
  static async getDashboardStats() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [totalStudents, totalPosts, attemptsThisWeek] = await Promise.all([
      prisma.user.count({ where: { role: "student" } }),
      prisma.post.count(), 
      prisma.quizAttempt.count({
        where: { createdAt: { gte: sevenDaysAgo } }
      })
    ]);

    const engagementRate = totalStudents > 0 
      ? Math.round((attemptsThisWeek / totalStudents) * 100) 
      : 0;

    return {
      students: totalStudents,
      activities: totalPosts, 
      engagement: { 
        rate: engagementRate, 
        totalThisWeek: attemptsThisWeek 
      } 
    };
  }
}