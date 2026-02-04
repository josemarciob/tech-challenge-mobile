import { Router } from "express";
import bcrypt from "bcryptjs"; // Alterado para bcryptjs (mais compatível)
import jwt from "jsonwebtoken";
import prisma  from "../prisma"; // Caminho correto do cliente Prisma

const router = Router();
const SECRET = process.env.JWT_SECRET || "segredo_temporario_para_debug";

//  ROTA DE CADASTRO 
router.post("/register", async (req, res) => {
  try {
    let { name, email, password, role, secretKey } = req.body;

    // Validação básica
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
    }

    // Se não vier role, assume 'student'. O banco espera 'student' ou 'professor'.
    if (!role || role === "estudante" || role === "aluno") {
        role = "student";
    }

    // Validação de Professor
    if (role === "professor") {
      const PROFESSOR_SECRET = "123"; // Defina isso no .env em produção
      if (secretKey !== PROFESSOR_SECRET) {
        return res.status(403).json({ error: "Chave de acesso de professor inválida." });
      }
    }

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(409).json({ error: "Este e-mail já está em uso." });
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar Usuário
    const user = await prisma.user.create({
      data: { 
        name, 
        email, 
        password: hashedPassword, 
        role,
        // Valores iniciais de gamificação
        xp: 0,
        moedas: 0,
        nivel: 1
      }
    });

    // Gerar Token (Para login automático)
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      SECRET,
      { expiresIn: "7d" } // Token dura 7 dias
    );

    // Remove a senha do retorno
    const { password: _, ...safeUser } = user;

    // Retorna User + Token
    return res.status(201).json({ user: safeUser, token });

  } catch (error) {
    console.error("Erro no registro:", error);
    return res.status(500).json({ error: "Erro interno ao criar conta." });
  }
});

// --- ROTA DE LOGIN ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "E-mail e senha obrigatórios." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Senha incorreta." });

    // Inclui id, role e name no token
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      SECRET,
      { expiresIn: "7d" }
    );

    // Remove a senha do retorno
    const { password: _, ...safeUser } = user;

    return res.json({ user: safeUser, token });

  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});

export default router;