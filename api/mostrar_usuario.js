import { connectDB } from "./db.js";

const server = createServer(async (req, res) => {
  // Só aceita POST
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ sucesso: false, erro: "Método não permitido" }));
  }

  // Lê o body
  let body = "";
  req.on("data", chunk => body += chunk);
  req.on("end", async () => {
    try {
      const data = JSON.parse(body);
      const cpfUsuario = data.cpfUsuario;

      if (!cpfUsuario) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ sucesso: false, erro: "CPF não enviado" }));
      }

      // Conecta ao banco
      const conn = await connectDB();

      // Consulta usuário
      const [rows] = await conn.execute(
        `SELECT nome, cpf, email, nascimento, endereco, telefone, sexo 
         FROM usuarios 
         WHERE cpf = ?`,
        [cpfUsuario]
      );

      await conn.end();

      if (rows.length === 0) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ sucesso: false, erro: "Usuário não encontrado" }));
      }

      // Retorna os dados do usuário
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ sucesso: true, usuario: rows[0] }));

    } catch (err) {
      console.error(err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ sucesso: false, erro: "Erro no servidor" }));
    }
  });

  req.on("error", err => {
    console.error("Erro na requisição:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ sucesso: false, erro: "Erro ao receber dados" }));
  });
});
