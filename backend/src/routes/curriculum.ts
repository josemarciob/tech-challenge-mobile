import { Router } from "express";

const router = Router();

// Dados Mockados da BNCC para o professor planejar aulas
const BNCC_DATABASE = [
  {
    id: 101,
    grade: "1ano",
    period: "1º Bimestre",
    subject: "Matemática",
    topic: "Funções",
    bnccCode: "EM13MAT302",
    title: "Função Afim: O Caso do Uber",
    content: "A Função Afim (f(x) = ax + b) serve para calcular valores com uma parte fixa e uma variável...",
    questions: [
      { text: "O que representa o 'b' na função f(x) = ax + b?", options: [{ text: "Valor Fixo", isCorrect: true }, { text: "Valor Variável", isCorrect: false }] }
    ]
  },
  {
    id: 102,
    grade: "1ano",
    period: "1º Bimestre",
    subject: "Física",
    topic: "Cinemática",
    bnccCode: "EM13CNT101",
    title: "Velocidade Média",
    content: "Velocidade Média é a razão entre a distância percorrida e o tempo gasto. Vm = ΔS / Δt...",
    questions: [
        { text: "Qual a fórmula da velocidade média?", options: [{ text: "Vm = ΔS / Δt", isCorrect: true }, { text: "Vm = Δt / ΔS", isCorrect: false }] }
    ]
  },
  {
    id: 103,
    grade: "2ano",
    period: "2º Bimestre",
    subject: "História",
    topic: "Brasil Colônia",
    bnccCode: "EM13CHS102",
    title: "Ciclo do Ouro",
    content: "O ciclo do ouro em Minas Gerais transformou a economia colonial...",
    questions: []
  }
];

router.get("/", (req, res) => {
  const { grade, period, subject } = req.query;

  let results = BNCC_DATABASE;

  if (grade) results = results.filter(i => i.grade === grade);
  if (period) results = results.filter(i => i.period === period);
  if (subject && subject !== "Todos") results = results.filter(i => i.subject === subject);

  res.json(results);
});

export default router;