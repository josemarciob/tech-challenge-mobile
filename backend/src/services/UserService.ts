import prisma from "../prisma";

export class UserService {
  static async listUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: { 
          id: true, 
          name: true, 
          email: true, 
          role: true, 
          xp: true, 
          level: true,  
          coins: true  
        }, 
      }),
      prisma.user.count(),
    ]);

    return { users, total };
  }

  static async getUserById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        xp: true,     
        coins: true, 
        level: true,
        completedActivities: true 
      }
    });
  }

  static async updateUser(id: number, data: any) {
    return await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true }
    });
  }

  static async deleteUser(id: number) {
    return await prisma.user.delete({ where: { id } });
  }
}