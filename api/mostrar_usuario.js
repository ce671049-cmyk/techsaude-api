import { connectDB } from "./db.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ sucesso: false, erro: "Método não permitido" });
    }

    let bodyData = "";
    await new Promise((resolve, reject) => {
      req.on("data", chunk => bodyData += chunk);
      req.on("end", resolve);
      req.on("error", reject);
    });

    let body;
    try {
      body = JSON.parse(bodyData);
    } catch (err) {
      return res.status(400).json({ sucesso: false, erro: "JSON inválido recebido" });
    }

    const { cpfUsuario } = body;

    const db = await connectDB();

    const [rows] = await db.execute(
      `SELECT nome, cpf, email, nascimento, endereco, telefone, sexo 
       FROM usuarios 
       WHERE cpf = ?`,
      [cpfUsuario]
    );

    await db.end();

    if (rows.length === 0) {
      return res.json({ sucesso: false, erro: "Usuário não encontrado" });
    }

    res.json({ sucesso: true, usuario: rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ sucesso: false, erro: "Erro no servidor" });
  }
}
