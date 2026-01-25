import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import postRoutes from "./routes/posts";
import atividadeRoutes from "./routes/atividades";
import commentRoutes from "./routes/comments";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.errorHandling();
  }

  private middlewares(): void {
    this.app.use(express.json());
    this.app.use(cors());
    
    // Logger de requisições simples
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
      next();
    });
  }

  private routes(): void {
    this.app.use("/auth", authRoutes);
    this.app.use("/users", userRoutes);
    this.app.use("/posts", postRoutes);
    this.app.use("/atividades", atividadeRoutes);
    this.app.use("/comments", commentRoutes);
  }

  private errorHandling(): void {
    // Rota 404
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({ error: `Not Found: ${req.method} ${req.path}` });
    });
  }
}

export default new App().app;