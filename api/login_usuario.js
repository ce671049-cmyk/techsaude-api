// api/login_usuario.js
import { connectDB } from "./db.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ erro: "Método não permitido" });
    }

    // Força JSON
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (err) {
        return res.status(400).json({ erro: "JSON inválido" });
      }
    }

    const { cpfUsuario, senhaUsuario } = body;

    if (!cpfUsuario || !senhaUsuario) {
      return res.status(400).json({ sucesso: false, erro: "Campos obrigatórios faltando" });
    }

    const db = await connectDB();

    // SELECT para verificar login
    const [rows] = await db.execute(
      `SELECT * FROM TB_Usuario WHERE cpfUsuario = ? AND senhaUsuario = ?`,
      [cpfUsuario, senhaUsuario]
    );

    await db.end();

    if (rows.length > 0) {
      // Login OK
      return res.status(200).json({
        sucesso: true,
        mensagem: "Login realizado com sucesso!",
        usuario: rows[0],
      });
    } else {
      // Login inválido
      return res.status(401).json({
        sucesso: false,
        erro: "CPF ou senha incorretos.",
      });
    }
  } catch (err) {
    console.error("💥 Erro no servidor:", err);
    return res.status(500).json({
      sucesso: false,
      erro: err.message || "Erro interno no servidor",
    });
  }
}
