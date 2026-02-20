import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// CONFIGURAÇÕES DE SEGURANÇA
// ==========================================
const JWT_SECRET = process.env.JWT_SECRET || "segredo_temporario_para_debug";
const PROFESSOR_SECRET = process.env.PROFESSOR_SECRET || "123";

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não definido no ambiente de produção!");
}

const generateToken = (user: { id: number; role: string; name: string }) => {
  return jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ==========================================
// ROTA DE CADASTRO
// ==========================================
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, secretKey } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios." });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    // Validação de Role
    let normalizedRole = "student";
    if (role === "professor") {
      if (secretKey !== PROFESSOR_SECRET) {
        res.status(403).json({ error: "Chave de acesso de professor inválida." });
        return;
      }
      normalizedRole = "professor";
    }

    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existingUser) {
      res.status(409).json({ error: "Este e-mail já está em uso." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const user = await prisma.user.create({
      data: { 
        name: name.trim(), 
        email: cleanEmail, 
        password: hashedPassword, 
        role: normalizedRole,
        xp: 0,
        coins: 1000, 
        level: 1,
        completedActivities: 0 
      }
    });

    const token = generateToken(user);
    
    const { password: _, ...safeUser } = user; 

    res.status(201).json({ user: safeUser, token });
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ error: "Erro interno ao criar conta." });
  }
});

// ==========================================
// ROTA DE LOGIN
// ==========================================
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "E-mail e senha são obrigatórios." });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user || !(await bcrypt.compare(password.trim(), user.password))) {
      res.status(401).json({ error: "E-mail ou senha incorretos." });
      return;
    }

    const token = generateToken(user);

    const { password: _, ...safeUser } = user; 

    res.json({ user: safeUser, token });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

export default router;