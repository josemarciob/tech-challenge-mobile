import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma";

const router = Router();
const SECRET = process.env.JWT_SECRET || "segredo_temporario_para_debug";

// Registro de usuário
router.post("/register", async (req, res) => {
  let { name, email, password, role, secretKey } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Nome, email, senha e role são obrigatórios" });
  }

  if (role === "estudante") role = "aluno";

  if (role === "professor") {
    const PROFESSOR_SECRET = "123";
    if (secretKey !== PROFESSOR_SECRET) {
      return res.status(403).json({ error: "Chave secreta inválida para professor" });
    }
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return res.status(409).json({ error: "Email já registrado" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role }
  });

  // Remove a senha antes de retornar
  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

// Login de usuário
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Senha inválida" });

  // Inclui id, role e name no token
  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

export default router;
