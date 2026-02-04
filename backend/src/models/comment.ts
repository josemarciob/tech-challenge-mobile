export interface Comment {
  id: number;
  postId: number | null;       
  atividadeId: number | null;  
  author: string;
  content: string;
  createdAt: Date;
}
