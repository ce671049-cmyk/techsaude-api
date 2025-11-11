import { connectDB } from "./db.js";

export default async function handler(req, res) {
  try {
    // Aceita apenas POST
    if (req.method !== "POST") {
      return res.status(405).json({ sucesso: false, erro: "Método não permitido" });
    }

    // 🔹 Converte o corpo para JSON se for string
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ sucesso: false, erro: "Formato JSON inválido" });
      }
    }

    const { cpfUsuario, senhaUsuario } = body;

    if (!cpfUsuario || !senhaUsuario) {
      return res.status(400).json({ sucesso: false, erro: "CPF e senha são obrigatórios" });
    }

    // Conecta ao banco
    const db = await connectDB();

    // Executa o SELECT
    const [rows] = await db.execute(
      "SELECT * FROM TB_Usuario WHERE cpfUsuario = ? AND senhaUsuario = ?",
      [cpfUsuario, senhaUsuario]
    );

    await db.end();

    if (rows.length > 0) {
      return res.status(200).json({ sucesso: true, mensagem: "Login realizado com sucesso!" });
    } else {
      return res.status(401).json({ sucesso: false, erro: "CPF ou senha incorretos!" });
    }

  } catch (err) {
    console.error("💥 Erro no servidor:", err);
    return res.status(500).json({ sucesso: false, erro: err.message || "Erro interno no servidor" });
  }
}
