import { Router } from "express";

const router = Router();

// Banco de Dados Mockado da BNCC
const BNCC_DATABASE = [
  // --- MATEMÁTICA ---
  {
    id: 101,
    grade: "1ano",
    period: "1º Bimestre",
    subject: "Matemática",
    topic: "Funções",
    bnccCode: "EM13MAT302",
    title: "Função Afim: O Caso do Uber",
    content: `📌 CONCEITO
A Função Afim (Função do 1º Grau) modela situações com um valor fixo e uma taxa de variação constante.

📝 FÓRMULA
f(x) = ax + b
• a: Taxa de variação (R$ por km).
• b: Valor fixo inicial (Bandeirada).
• x: Variável (Km rodados).

💡 EXEMPLO (UBER)
Preço = 2x + 5
- R$ 5,00 para entrar no carro.
- R$ 2,00 a cada km rodado.`,
    questions: [
      { text: "No exemplo do Uber (2x + 5), o que significa o número 5?", options: [{ text: "A tarifa fixa de partida", isCorrect: true }, { text: "O preço por km", isCorrect: false }, { text: "A distância total", isCorrect: false }, { text: "O desconto", isCorrect: false }] },
      { text: "Qual seria o valor de uma corrida de 10km?", options: [{ text: "R$ 25,00", isCorrect: true }, { text: "R$ 20,00", isCorrect: false }, { text: "R$ 15,00", isCorrect: false }, { text: "R$ 30,00", isCorrect: false }] },
      { text: "O que representa o coeficiente 'a' na função f(x) = ax + b?", options: [{ text: "A taxa de variação", isCorrect: true }, { text: "O valor inicial", isCorrect: false }, { text: "O resultado final", isCorrect: false }, { text: "A variável independente", isCorrect: false }] },
      { text: "Se a corrida custou R$ 15,00, quantos km foram rodados? (15 = 2x + 5)", options: [{ text: "5 km", isCorrect: true }, { text: "10 km", isCorrect: false }, { text: "2 km", isCorrect: false }, { text: "7 km", isCorrect: false }] },
      { text: "Qual destas situações NÃO é uma função afim?", options: [{ text: "Área de um quadrado (x²)", isCorrect: true }, { text: "Conta de luz com taxa fixa", isCorrect: false }, { text: "Salário com comissão", isCorrect: false }, { text: "Preço do táxi", isCorrect: false }] }
    ]
  },
  {
    id: 104,
    grade: "2ano",
    period: "2º Bimestre",
    subject: "Matemática",
    topic: "Geometria Espacial",
    bnccCode: "EM13MAT201",
    title: "Volume de Prismas: Caixas e Piscinas",
    content: `📌 CONCEITO
O volume de um prisma é o espaço interno dele. É calculado multiplicando a área do chão (base) pela altura da parede.

📝 FÓRMULA
V = Ab • h
• Ab: Área da Base.
• h: Altura.

💡 DICA
1 m³ (metro cúbico) = 1000 Litros.`,
    questions: [
        { text: "Qual a fórmula geral do volume do prisma?", options: [{ text: "V = Área da Base x Altura", isCorrect: true }, { text: "V = Base x Altura / 2", isCorrect: false }, { text: "V = Lado x Lado", isCorrect: false }, { text: "V = 2 x Pi x Raio", isCorrect: false }] },
        { text: "Uma caixa tem base de 10m² e altura de 2m. Qual o volume?", options: [{ text: "20 m³", isCorrect: true }, { text: "12 m³", isCorrect: false }, { text: "5 m³", isCorrect: false }, { text: "100 m³", isCorrect: false }] },
        { text: "Quantos litros de água cabem em uma piscina de 100 m³?", options: [{ text: "100.000 Litros", isCorrect: true }, { text: "1.000 Litros", isCorrect: false }, { text: "100 Litros", isCorrect: false }, { text: "10.000 Litros", isCorrect: false }] },
        { text: "Se dobrarmos a altura do prisma mantendo a base, o volume...", options: [{ text: "Dobra", isCorrect: true }, { text: "Quadruplica", isCorrect: false }, { text: "Não muda", isCorrect: false }, { text: "Cai pela metade", isCorrect: false }] },
        { text: "Qual destes objetos é um exemplo de prisma?", options: [{ text: "Uma caixa de sapato", isCorrect: true }, { text: "Uma bola de futebol", isCorrect: false }, { text: "Um chapéu de festa (cone)", isCorrect: false }, { text: "Uma pirâmide", isCorrect: false }] }
    ]
  },

  // --- FÍSICA ---
  {
    id: 102,
    grade: "1ano",
    period: "1º Bimestre",
    subject: "Física",
    topic: "Cinemática",
    bnccCode: "EM13CNT101",
    title: "Velocidade Média",
    content: `📌 CONCEITO
Velocidade Média (Vm) considera todo o percurso e todo o tempo gasto, incluindo paradas.

📝 FÓRMULA
Vm = ΔS / Δt
• ΔS: Distância percorrida.
• Δt: Tempo total gasto.`,
    questions: [
        { text: "Qual a fórmula da velocidade média?", options: [{ text: "Vm = ΔS / Δt", isCorrect: true }, { text: "Vm = Δt / ΔS", isCorrect: false }, { text: "Vm = ΔS * Δt", isCorrect: false }, { text: "Vm = ΔS + Δt", isCorrect: false }] },
        { text: "Um carro andou 200km em 4 horas. Qual a Vm?", options: [{ text: "50 km/h", isCorrect: true }, { text: "80 km/h", isCorrect: false }, { text: "100 km/h", isCorrect: false }, { text: "25 km/h", isCorrect: false }] },
        { text: "Se a Vm é 80km/h, quanto tempo levo para andar 160km?", options: [{ text: "2 horas", isCorrect: true }, { text: "3 horas", isCorrect: false }, { text: "1 hora", isCorrect: false }, { text: "4 horas", isCorrect: false }] },
        { text: "Velocidade Média significa que o carro manteve a mesma velocidade o tempo todo?", options: [{ text: "Não, ele pode ter variado", isCorrect: true }, { text: "Sim, sempre constante", isCorrect: false }, { text: "Sim, mas só em retas", isCorrect: false }, { text: "Depende do carro", isCorrect: false }] },
        { text: "O que significa ΔS na fórmula?", options: [{ text: "Variação de Espaço (Distância)", isCorrect: true }, { text: "Variação de Tempo", isCorrect: false }, { text: "Velocidade Final", isCorrect: false }, { text: "Aceleração", isCorrect: false }] }
    ]
  },
  {
    id: 105,
    grade: "3ano",
    period: "1º Bimestre",
    subject: "Física",
    topic: "Eletricidade",
    bnccCode: "EM13CNT103",
    title: "1ª Lei de Ohm: Tensão e Corrente",
    content: `📌 CONCEITO
Relaciona Tensão (Força), Corrente (Fluxo) e Resistência (Dificuldade).

📝 FÓRMULA
U = R • i
• U: Tensão (Volts).
• R: Resistência (Ohms).
• i: Corrente (Amperes).`,
    questions: [
        { text: "Se aumentarmos a Resistência (R), o que acontece com a Corrente (i)?", options: [{ text: "Diminui (passa menos carga)", isCorrect: true }, { text: "Aumenta (passa mais carga)", isCorrect: false }, { text: "Fica igual", isCorrect: false }, { text: "A tensão aumenta", isCorrect: false }] },
        { text: "Qual a unidade de medida da Resistência?", options: [{ text: "Ohms (Ω)", isCorrect: true }, { text: "Volts (V)", isCorrect: false }, { text: "Amperes (A)", isCorrect: false }, { text: "Watts (W)", isCorrect: false }] },
        { text: "Em um chuveiro, quem esquenta a água?", options: [{ text: "O Resistor (Resistência)", isCorrect: true }, { text: "A Tensão", isCorrect: false }, { text: "O disjuntor", isCorrect: false }, { text: "O fio terra", isCorrect: false }] },
        { text: "Calcule a Tensão (U) se R=10 e i=2.", options: [{ text: "20 Volts", isCorrect: true }, { text: "5 Volts", isCorrect: false }, { text: "12 Volts", isCorrect: false }, { text: "8 Volts", isCorrect: false }] },
        { text: "Qual a função da Tensão (Voltagem)?", options: [{ text: "Empurrar os elétrons", isCorrect: true }, { text: "Frear os elétrons", isCorrect: false }, { text: "Armazenar energia", isCorrect: false }, { text: "Medir o tempo", isCorrect: false }] }
    ]
  },

  // --- QUÍMICA ---
  {
    id: 201,
    grade: "1ano",
    period: "1º Bimestre",
    subject: "Química",
    topic: "Modelos Atômicos",
    bnccCode: "EM13CNT201",
    title: "O Átomo de Bohr",
    content: `📌 CONCEITO
Bohr propôs que os elétrons giram em camadas de energia específicas ao redor do núcleo.

💡 SALTO QUÂNTICO
Quando um elétron ganha energia, ele pula para fora. Quando volta, emite LUZ (fóton). É assim que funcionam os fogos de artifício.`,
    questions: [
        { text: "Onde ficam os prótons no modelo de Bohr?", options: [{ text: "No Núcleo", isCorrect: true }, { text: "Na Eletrosfera", isCorrect: false }, { text: "Girando ao redor", isCorrect: false }, { text: "Não existem prótons", isCorrect: false }] },
        { text: "O que acontece quando o elétron volta para sua camada original?", options: [{ text: "Emite luz (energia)", isCorrect: true }, { text: "Absorve luz", isCorrect: false }, { text: "O átomo explode", isCorrect: false }, { text: "Vira um próton", isCorrect: false }] },
        { text: "As camadas da eletrosfera (K, L, M) representam:", options: [{ text: "Níveis de energia", isCorrect: true }, { text: "Tamanho do núcleo", isCorrect: false }, { text: "Velocidade do átomo", isCorrect: false }, { text: "Temperatura", isCorrect: false }] },
        { text: "Qual a carga do Elétron?", options: [{ text: "Negativa (-)", isCorrect: true }, { text: "Positiva (+)", isCorrect: false }, { text: "Neutra", isCorrect: false }, { text: "Variável", isCorrect: false }] },
        { text: "O modelo de Bohr é comparado a qual sistema?", options: [{ text: "Sistema Solar", isCorrect: true }, { text: "Bola de Bilhar", isCorrect: false }, { text: "Pudim de Passas", isCorrect: false }, { text: "Nuvem difusa", isCorrect: false }] }
    ]
  },

  // --- BIOLOGIA ---
  {
    id: 301,
    grade: "1ano",
    period: "2º Bimestre",
    subject: "Biologia",
    topic: "Citologia",
    bnccCode: "EM13CNT202",
    title: "A Célula e suas Organelas",
    content: `📌 CONCEITO
A célula funciona como uma cidade.
• Núcleo: Prefeitura (DNA).
• Membrana: Muro com portões.
• Mitocôndria: Usina de Energia.
• Ribossomo: Fábrica de Proteínas.`,
    questions: [
        { text: "Qual a função da Mitocôndria?", options: [{ text: "Produzir Energia (Respiração)", isCorrect: true }, { text: "Proteger o DNA", isCorrect: false }, { text: "Fazer digestão", isCorrect: false }, { text: "Armazenar água", isCorrect: false }] },
        { text: "Quem controla o que entra e sai da célula?", options: [{ text: "Membrana Plasmática", isCorrect: true }, { text: "Citoplasma", isCorrect: false }, { text: "Núcleo", isCorrect: false }, { text: "Lisossomo", isCorrect: false }] },
        { text: "Onde fica guardado o material genético (DNA)?", options: [{ text: "No Núcleo", isCorrect: true }, { text: "Na Mitocôndria", isCorrect: false }, { text: "No Complexo de Golgi", isCorrect: false }, { text: "No Ribossomo", isCorrect: false }] },
        { text: "Qual a função dos Ribossomos?", options: [{ text: "Produzir Proteínas", isCorrect: true }, { text: "Produzir Gordura", isCorrect: false }, { text: "Quebrar açúcar", isCorrect: false }, { text: "Transportar oxigênio", isCorrect: false }] },
        { text: "Qual organela é abundante em células musculares (que gastam muita energia)?", options: [{ text: "Mitocôndria", isCorrect: true }, { text: "Cloroplasto", isCorrect: false }, { text: "Centríolo", isCorrect: false }, { text: "Vacúolo", isCorrect: false }] }
    ]
  },

  // --- HISTÓRIA ---
  {
    id: 401,
    grade: "3ano",
    period: "3º Bimestre",
    subject: "História",
    topic: "Guerra Fria",
    bnccCode: "EM13CHS103",
    title: "Guerra Fria: EUA vs URSS",
    content: `📌 CONCEITO
Conflito ideológico indireto entre Capitalismo (EUA) e Socialismo (URSS).

🚀 DESTAQUES
• Corrida Espacial (Lua vs Satélites).
• Muro de Berlim (Símbolo da divisão).
• Medo Nuclear (Ninguém atirava direto).`,
    questions: [
        { text: "Por que foi chamada de 'Guerra Fria'?", options: [{ text: "Não houve conflito direto entre as potências", isCorrect: true }, { text: "Aconteceu na Antártida", isCorrect: false }, { text: "Usaram armas de gelo", isCorrect: false }, { text: "Durou pouco tempo", isCorrect: false }] },
        { text: "Qual o maior símbolo físico da divisão do mundo?", options: [{ text: "Muro de Berlim", isCorrect: true }, { text: "Torre Eiffel", isCorrect: false }, { text: "Estátua da Liberdade", isCorrect: false }, { text: "Muralha da China", isCorrect: false }] },
        { text: "Quais eram os dois sistemas econômicos em disputa?", options: [{ text: "Capitalismo e Socialismo", isCorrect: true }, { text: "Feudalismo e Escravismo", isCorrect: false }, { text: "Monarquia e República", isCorrect: false }, { text: "Anarquismo e Fascismo", isCorrect: false }] },
        { text: "Quem chegou à Lua primeiro?", options: [{ text: "Estados Unidos (EUA)", isCorrect: true }, { text: "União Soviética (URSS)", isCorrect: false }, { text: "China", isCorrect: false }, { text: "Alemanha", isCorrect: false }] },
        { text: "O que foi a Corrida Armamentista?", options: [{ text: "Disputa para ter mais armas nucleares", isCorrect: true }, { text: "Uma maratona olímpica", isCorrect: false }, { text: "Troca de armas por comida", isCorrect: false }, { text: "O fim do exército", isCorrect: false }] }
    ]
  },

  // --- GEOGRAFIA ---
  {
    id: 502,
    grade: "2ano",
    period: "4º Bimestre",
    subject: "Geografia",
    topic: "Geopolítica",
    bnccCode: "EM13CHS202",
    title: "Globalização",
    content: `📌 CONCEITO
Integração mundial econômica e cultural.

🌍 MOTORES
• Transportes rápidos e baratos.
• Internet e Telecomunicações.

💡 EXEMPLO
Um tênis desenhado nos EUA, couro da Argentina, montado no Vietnã e vendido no Brasil.`,
    questions: [
        { text: "Qual fator foi essencial para a Globalização acelerar?", options: [{ text: "Avanço da Internet e Transportes", isCorrect: true }, { text: "A descoberta do fogo", isCorrect: false }, { text: "O isolamento dos países", isCorrect: false }, { text: "A queda da bolsa", isCorrect: false }] },
        { text: "O que é uma transnacional?", options: [{ text: "Empresa que atua em vários países", isCorrect: true }, { text: "Empresa local de bairro", isCorrect: false }, { text: "O governo de um país", isCorrect: false }, { text: "Uma ONG", isCorrect: false }] },
        { text: "Qual é um ponto negativo da Globalização?", options: [{ text: "Aumento da desigualdade e perda cultural", isCorrect: true }, { text: "Aumento da paz mundial", isCorrect: false }, { text: "Fim das fronteiras físicas", isCorrect: false }, { text: "Todos ficam ricos iguais", isCorrect: false }] },
        { text: "Como a cultura é afetada pela Globalização?", options: [{ text: "Há uma padronização (todos consomem o mesmo)", isCorrect: true }, { text: "Cada país fica mais isolado", isCorrect: false }, { text: "Ninguém assiste filmes estrangeiros", isCorrect: false }, { text: "As línguas locais somem instantaneamente", isCorrect: false }] },
        { text: "O que significa 'Cadeia Global de Produção'?", options: [{ text: "Um produto é feito em várias etapas pelo mundo", isCorrect: true }, { text: "Tudo é feito em uma única fábrica", isCorrect: false }, { text: "Produção artesanal", isCorrect: false }, { text: "Venda apenas local", isCorrect: false }] }
    ]
  },

  // --- REDAÇÃO ---
  {
    id: 601,
    grade: "3ano",
    period: "1º Bimestre",
    subject: "Redação",
    topic: "Dissertação",
    bnccCode: "EM13LP05",
    title: "Redação ENEM: Estrutura",
    content: `📌 ESTRUTURA
Texto Dissertativo-Argumentativo (Opinião + Fatos).

🏗️ PARTES
1. Introdução: Tese (Sua opinião).
2. Desenvolvimento: Argumentos (Porquê).
3. Conclusão: Proposta de Intervenção (Solução prática).`,
    questions: [
        { text: "O que é obrigatório na conclusão da redação do ENEM?", options: [{ text: "Proposta de Intervenção (Solução)", isCorrect: true }, { text: "Resumo do texto", isCorrect: false }, { text: "Uma pergunta para o leitor", isCorrect: false }, { text: "Assinar seu nome", isCorrect: false }] },
        { text: "O que deve conter na Introdução?", options: [{ text: "A apresentação do tema e a Tese", isCorrect: true }, { text: "A solução do problema", isCorrect: false }, { text: "Dois argumentos completos", isCorrect: false }, { text: "Uma piada", isCorrect: false }] },
        { text: "Qual o tipo de texto exigido no ENEM?", options: [{ text: "Dissertativo-Argumentativo", isCorrect: true }, { text: "Poema", isCorrect: false }, { text: "Narração (História)", isCorrect: false }, { text: "Receita de bolo", isCorrect: false }] },
        { text: "O que são os 'Argumentos'?", options: [{ text: "Provas e fatos que defendem sua opinião", isCorrect: true }, { text: "Brigas com o leitor", isCorrect: false }, { text: "Cópia dos textos motivadores", isCorrect: false }, { text: "A opinião do corretor", isCorrect: false }] },
        { text: "Para que serve a Proposta de Intervenção?", options: [{ text: "Para sugerir uma solução prática para o problema", isCorrect: true }, { text: "Para criticar o governo apenas", isCorrect: false }, { text: "Para finalizar com uma frase bonita", isCorrect: false }, { text: "Para aumentar o número de linhas", isCorrect: false }] }
    ]
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