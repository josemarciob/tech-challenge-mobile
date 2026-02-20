import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";


import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import postRoutes from "./routes/posts";
import statsRoutes from "./routes/stats";
import curriculumRoutes from "./routes/curriculum";
import farmRoutes from "./routes/farm";
import shopRoutes from "./routes/shop";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.healthCheck();
    this.routes();
    this.errorHandling();
  }

  private middlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true })); 
    this.app.use(cors());
    
    // Logger simples
    if (process.env.NODE_ENV !== 'test') {
      this.app.use((req: Request, res: Response, next: NextFunction) => {
        console.log(`[${new Date().toLocaleTimeString('pt-BR')}] ${req.method} ${req.path}`);
        next();
      });
    }
  }

  private healthCheck(): void {
    this.app.get("/health", (req: Request, res: Response) => {
      res.status(200).json({ status: "ok", uptime: process.uptime() });
    });
  }

  private routes(): void {
    const apiPrefix = "/api";

    this.app.use(`${apiPrefix}/auth`, authRoutes);
    this.app.use(`${apiPrefix}/users`, userRoutes);
    this.app.use(`${apiPrefix}/posts`, postRoutes);
    this.app.use(`${apiPrefix}/stats`, statsRoutes);
    this.app.use(`${apiPrefix}/curriculum`, curriculumRoutes);
    this.app.use(`${apiPrefix}/farm`, farmRoutes);
    this.app.use(`${apiPrefix}/shop`, shopRoutes); 
  }

  private errorHandling(): void {
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({ 
        error: "Não encontrado", 
        message: `A rota ${req.method} ${req.path} não existe neste servidor.` 
      });
    });


    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error("Erro Crítico no Servidor:", err.stack);
      res.status(500).json({ 
        error: "Erro Interno", 
        message: "Ocorreu um erro inesperado. Nossa equipe técnica já foi notificada." 
      });
    });
  }
}

export default new App().app;