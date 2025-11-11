import { connectDB } from "./db.js";

// Função para ler o body da requisição
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

const server = createServer(async (req, res) => {
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ sucesso: false, erro: "Método não permitido" }));
    return;
  }

  try {
    const bodyData = await getRequestBody(req);
    let body;
    try {
      body = JSON.parse(bodyData);
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ sucesso: false, erro: "JSON inválido" }));
      return;
    }

    const { cpfUsuario } = body;
    if (!cpfUsuario) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ sucesso: false, erro: "CPF não informado" }));
      return;
    }

    const db = await connectDB();

    const [rows] = await db.execute(
      `SELECT nome, cpf, email, nascimento, endereco, telefone, sexo 
       FROM usuarios 
       WHERE cpf = ?`,
      [cpfUsuario]
    );

    await db.end();

    if (rows.length === 0) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ sucesso: false, erro: "Usuário não encontrado" }));
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ sucesso: true, usuario: rows[0] }));

  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ sucesso: false, erro: "Erro no servidor" }));
  }
});

// Porta do servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
