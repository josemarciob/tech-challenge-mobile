const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

let users = [];
let posts = [];

// Registro de usuário
app.post("/auth/register", (req, res) => {
  const { name, email, password, role } = req.body;
  const id = users.length + 1;
  const user = { id, name, email, password, role };
  users.push(user);
  res.json(user);
});

// listar todos os usuários
app.get("/users", (req, res) => {
  res.json(users);
});


// Login
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Credenciais inválidas" });
  const token = "fake-jwt-token"; // token fake só para teste
  res.json({ token, user });
});

// Listar posts
app.get("/posts", (req, res) => res.json(posts));

// Criar post
app.post("/posts", (req, res) => {
  const { title, content, authorId, authorName } = req.body;
  const id = posts.length + 1;
  const post = { id, title, content, authorId, authorName };
  posts.push(post);
  res.json(post);
});

// Detalhes de post
app.get("/posts/:id", (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (!post) return res.status(404).json({ error: "Atividade não encontrada" });
  res.json(post);
});

app.listen(3000, () => console.log("Backend rodando na porta 3000"));
