export interface Comment {
  id: number;
  postId: number | null;       // se for comentário de post
  atividadeId: number | null;  // se for comentário de atividade
  author: string;
  content: string;
  createdAt: Date;
}
