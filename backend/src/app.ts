import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import postRoutes from "./routes/posts";
import commentRoutes from "./routes/comments";
import statsRoutes from "./routes/stats";
import curriculumRoutes from "./routes/curriculum";

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
    
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
      next();
    });
  }

  private routes(): void {
    this.app.use("/auth", authRoutes);
    this.app.use("/users", userRoutes);
    this.app.use("/posts", postRoutes);
    this.app.use("/comments", commentRoutes);
    this.app.use("/stats", statsRoutes);
    this.app.use("/curriculum", curriculumRoutes);
  }

  private errorHandling(): void {
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({ error: `Not Found: ${req.method} ${req.path}` });
    });
  }
}

export default new App().app;