import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "segredo_temporario_para_debug";

export interface AuthRequest extends Request {
  user?: { id: number; role: string; name: string };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Token não fornecido" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET) as { id: number; role: string; name: string };
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: "Token inválido" });
  }
}
