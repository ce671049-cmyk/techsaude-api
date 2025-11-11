import { connectDB } from "./db.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ erro: "Método não permitido" });
    }

    // 🔹 Converte body em JSON (caso venha como texto)
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (err) {
        console.error("❌ Erro ao converter JSON:", err);
        return res.status(400).json({ sucesso: false, erro: "Formato inválido de JSON" });
      }
    }

    const { cpfUsuario, senhaUsuario } = body;

    if (!cpfUsuario || !senhaUsuario) {
      return res.status(400).json({ sucesso: false, erro: "CPF e senha são obrigatórios" });
    }

    const db = await connectDB();

    // 🔹 Busca o usuário
    const [rows] = await db.execute(
      "SELECT * FROM TB_Usuario WHERE cpfUsuario = ? AND senhaUsuario = ?",
      [cpfUsuario, senhaUsuario]
    );

    await db.end();

    if (rows.length > 0) {
      return res.status(200).json({ sucesso: true, mensagem: "Login realizado com sucesso!", usuario: rows[0] });
    } else {
      return res.status(401).json({ sucesso: false, erro: "CPF ou senha incorretos" });
    }
  } catch (err) {
    console.error("💥 Erro no servidor:", err);
    return res.status(500).json({ sucesso: false, erro: err.message || "Erro interno no servidor" });
  }
}
