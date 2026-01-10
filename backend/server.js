const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

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
app.get("/users", (req, res) => res.json(users));

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
app.get("/posts", (req, res) => res.json(posts));

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

  res.json({ message: "Post e comentários excluídos com sucesso", post: deleted[0] });
});

// Detalhes de post
app.get("/posts/:id", (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (!post) return res.status(404).json({ error: "Atividade não encontrada" });
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

// Criar comentário
app.post("/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  const { author, content } = req.body;

  const comment = {
    id: comments.length + 1,
    postId: id,
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
  res.json({ success: true });
});

app.listen(3000, () => console.log("Backend rodando na porta 3000"));
