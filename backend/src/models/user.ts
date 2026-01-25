export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // armazenada com hash
  role: "aluno" | "professor";
  xp: number;
  nivel: number;
  moedas: number;
  conquistas: string[]; // lista de badges ou conquistas
}
