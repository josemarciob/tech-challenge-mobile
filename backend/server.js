const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

// simple request logger to help debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

let users = [];
let posts = [];
let atividades = [];
let comments = [];

// salvar comentários em arquivo
function saveComments() {
  fs.writeFileSync("comments.json", JSON.stringify(comments, null, 2));
}

// carregar comentários ao iniciar servidor
if (fs.existsSync("comments.json")) {
  comments = JSON.parse(fs.readFileSync("comments.json"));
}

// Registro de usuário
app.post("/auth/register", (req, res) => {
  const { name, email, password, role, secretKey } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Nome, email, senha e role são obrigatórios" });
  }

  if (role === "professor") {
    const PROFESSOR_SECRET = "123";
    if (secretKey !== PROFESSOR_SECRET) {
      return res.status(403).json({ error: "Chave secreta inválida para professor" });
    }
  }

  const id = users.length + 1;
  const user = { id, name, email, password, role };
  users.push(user);
  res.json(user);
});

// listar todos os usuários
app.get("/users", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = users.slice(startIndex, endIndex);

  res.json({
    page,
    limit,
    total: users.length,
    data: results,
  });
});

// Atualizar usuário
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  const userIndex = users.findIndex(u => u.id == id);
  if (userIndex === -1) return res.status(404).json({ error: "Usuário não encontrado" });

  users[userIndex] = { ...users[userIndex], name, email, role };
  res.json(users[userIndex]);
});

// Deletar usuário
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex(u => u.id == id);
  if (userIndex === -1) return res.status(404).json({ error: "Usuário não encontrado" });

  users.splice(userIndex, 1);
  res.json({ message: "Usuário deletado com sucesso" });
});




// Login
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

  const token = "jwt_token_fake"; // simplificado

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

// Listar posts
// Listar posts com paginação
app.get("/posts", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = posts.slice(startIndex, endIndex);

  res.json({
    page,
    limit,
    total: posts.length,
    data: results,
  });
});


// Criar post (somente professor)
app.post("/posts", (req, res) => {
  const { title, content, authorId, authorName } = req.body;
  const user = users.find(u => u.id == authorId);

  if (!user) return res.status(400).json({ error: "Autor inválido" });
  if (user.role !== "professor") return res.status(403).json({ error: "Somente professores podem criar posts" });
  if (!title || !content) return res.status(400).json({ error: "Título e conteúdo são obrigatórios" });
  if (title.length < 8 || title.length > 20) return res.status(400).json({ error: "Título deve ter entre 8 e 20 caracteres" });
  if (content.length < 10 || content.length > 100) return res.status(400).json({ error: "Conteúdo deve ter entre 10 e 100 caracteres" });

  const id = posts.length + 1;
  const post = { id, title, content, authorId, authorName };
  posts.push(post);
  res.json(post);
});

// Editar post
app.put("/posts/:id", (req, res) => {
  const { id } = req.params;
  const { title, content, authorId } = req.body;
  const user = users.find(u => u.id == authorId);

  if (!user) return res.status(400).json({ error: "Autor inválido" });
  if (user.role !== "professor") return res.status(403).json({ error: "Somente professores podem editar posts" });

  const postIndex = posts.findIndex(p => p.id == id);
  if (postIndex === -1) return res.status(404).json({ error: "Post não encontrado" });

  if (!title || !content) return res.status(400).json({ error: "Título e conteúdo são obrigatórios" });
  if (title.length < 8 || title.length > 20) return res.status(400).json({ error: "Título deve ter entre 8 e 20 caracteres" });
  if (content.length < 10 || content.length > 100) return res.status(400).json({ error: "Conteúdo deve ter entre 10 e 100 caracteres" });

  posts[postIndex] = { ...posts[postIndex], title, content };
  res.json(posts[postIndex]);
});

// Excluir post
app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  const { authorId } = req.body;
  const user = users.find(u => u.id == authorId);

  if (!user) return res.status(400).json({ error: "Autor inválido" });
  if (user.role !== "professor") return res.status(403).json({ error: "Somente professores podem excluir posts" });

  const postIndex = posts.findIndex(p => p.id == id);
  if (postIndex === -1) return res.status(404).json({ error: "Post não encontrado" });

  const deleted = posts.splice(postIndex, 1);
  comments = comments.filter(c => c.postId != id);
  saveComments();

  res.json({ message: "Post e comentários excluídos com sucesso", post: deleted[0] });
});

// Detalhes de post
app.get("/posts/:id", (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (!post) return res.status(404).json({ error: "Post não encontrado" });
  res.json(post);
});

// Criar atividade
app.post("/atividades", (req, res) => {
  const { title, description, content, authorId, authorName } = req.body;
  const user = users.find(u => u.id == authorId);

  if (!user) return res.status(400).json({ error: "Autor inválido" });
  if (user.role !== "professor") return res.status(403).json({ error: "Somente professores podem criar atividades" });
  if (!title || !content) return res.status(400).json({ error: "Título e conteúdo são obrigatórios" });

  const id = atividades.length + 1;
  const atividade = { id, title, description, content, authorId, authorName };
  atividades.push(atividade);
  res.json(atividade);
});

// Listar atividades
app.get("/atividades", (req, res) => res.json(atividades));

// Detalhes de atividade
app.get("/atividades/:id", (req, res) => {
  const atividade = atividades.find(a => a.id == req.params.id);
  if (!atividade) return res.status(404).json({ error: "Atividade não encontrada" });
  res.json(atividade);
});

// Excluir atividade
app.delete("/atividades/:id", (req, res) => {
  const { id } = req.params;
  const { authorId } = req.body;
  const user = users.find(u => u.id == authorId);

  if (!user) return res.status(400).json({ error: "Autor inválido" });
  if (user.role !== "professor") return res.status(403).json({ error: "Somente professores podem excluir atividades" });

  const atividadeIndex = atividades.findIndex(a => a.id == id);
  if (atividadeIndex === -1) return res.status(404).json({ error: "Atividade não encontrada" });

  const deleted = atividades.splice(atividadeIndex, 1);
  comments = comments.filter(c => c.atividadeId != id);
  saveComments();

  res.json({ message: "Atividade e comentários excluídos com sucesso", atividade: deleted[0] });
});

// Criar comentário em post
app.post("/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  const { author, content } = req.body;

  const comment = {
    id: comments.length + 1,
    postId: id,
    atividadeId: null,
    author,
    content,
    createdAt: new Date(),
  };

  comments.push(comment);
  saveComments();
  res.json(comment);
});

// Listar comentários de um post
app.get("/posts/:id/comments", (req, res) => {
  const postId = req.params.id;
  const postComments = comments.filter(c => c.postId == postId);
  res.json(postComments);
});

// Criar comentário em atividade
app.post("/atividades/:id/comments", (req, res) => {
  const { id } = req.params;
  const { author, content } = req.body;

  const comment = {
    id: comments.length + 1,
    postId: null,
    atividadeId: id,
    author,
    content,
    createdAt: new Date(),
  };

  comments.push(comment);
  saveComments();
  res.json(comment);
});

// Listar comentários de uma atividade 
app.get("/atividades/:id/comments", (req, res) => { 
    const atividadeId = req.params.id;
    const atividadeComments = comments.filter(c => c.atividadeId == atividadeId); 
    res.json(atividadeComments); 
});

// return JSON 404 for unmatched routes (avoid Express's HTML 404 page)
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

// bind explicitly to 127.0.0.1 to avoid IPv6/localhost resolution issues on Windows
const HOST = '127.0.0.1';
app.listen(3000, HOST, () => console.log(`Backend rodando na porta 3000 (host=${HOST})`));
