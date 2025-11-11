import { connectDB } from "./db.js";

export default async function handler(req, res) {
  try {
    // 🔹 Permite apenas POST
    if (req.method !== "POST") {
      return res.status(405).json({ sucesso: false, erro: "Método não permitido" });
    }

    // 🔹 Força a leitura manual do corpo
    let bodyData = "";
    await new Promise((resolve, reject) => {
      req.on("data", chunk => bodyData += chunk);
      req.on("end", resolve);
      req.on("error", reject);
    });

    // 🔹 Tenta converter o body em JSON
    let body;
    try {
      body = JSON.parse(bodyData);
    } catch (err) {
      console.error("❌ Body inválido:", bodyData);
      return res.status(400).json({ sucesso: false, erro: "JSON inválido recebido" });
    }

    // 🔹 Extrai os campos
    const {
      cpfUsuario
    } = body;



    console.log("📥 Dados recebidos:", body);

    // 🔹 Conecta ao banco
    const db = await connectDB();

    // Buscar usuário pelo CPF
    const [rows] = await conn.execute(
      `SELECT nome, cpf, email, nascimento, endereco, telefone, sexo 
       FROM usuarios 
       WHERE cpf = ?`
      [cpfUsuario]
    );

    await conn.end();

    if (rows.length === 0) {
      return res.json({ sucesso: false, erro: "Usuário não encontrado" });
    }

    // Retornar os dados do usuário
    res.json({ sucesso: true, usuario: rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ sucesso: false, erro: "Erro no servidor" });
  }
});

// Definir porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
