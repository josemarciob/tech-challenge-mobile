import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error("ERRO CRÍTICO: JWT_SECRET não configurado em ambiente de produção!");
  }
  console.warn("AVISO: JWT_SECRET não definido. Usando segredo de desenvolvimento.");
}

const SECRET_KEY = JWT_SECRET || "segredo_temporario_para_debug";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: string; name: string };
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ 
      error: "Acesso negado. Token não fornecido ou mal formatado.",
      code: "NO_TOKEN" 
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: number; role: string; name: string };
    
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        error: "Sessão expirada. Faça login novamente.", 
        code: "TOKEN_EXPIRED" 
      });
      return;
    }

    //Log interno para debug 
    console.error("Erro de Autenticação:", (error as Error).message);

    res.status(403).json({ 
      error: "Token inválido ou corrompido.", 
      code: "TOKEN_INVALID" 
    });
  }
}