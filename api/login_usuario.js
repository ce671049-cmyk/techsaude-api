import { connectDB } from "./db.js";

export default async function handler(req, res) {
  try {
    // Aceita apenas POST
    if (req.method !== "POST") {
      return res.status(405).json({ sucesso: false, erro: "Método não permitido" });
    }

    // Força conversão do corpo para JSON
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (err) {
        console.error("Erro ao converter JSON:", err);
        return res.status(400).json({ sucesso: false, erro: "JSON inválido" });
      }
    }

    const { cpfUsuario, senhaUsuario } = body;

    if (!cpfUsuario || !senhaUsuario) {
      return res.status(400).json({ sucesso: false, erro: "Campos obrigatórios ausentes" });
    }

    const db = await connectDB();

    // ✅ QUERY COM ARRAY DE PARÂMETROS
    const [rows] = await db.execute(
      "SELECT * FROM TB_Usuario WHERE cpfUsuario = ? AND senhaUsuario = ?",
      [cpfUsuario, senhaUsuario]
    );

    await db.end();

    if (rows.length > 0) {
      return res.status(200).json({ sucesso: true, usuario: rows[0] });
    } else {
      return res.status(401).json({ sucesso: false, erro: "CPF ou senha inválidos" });
    }

  } catch (err) {
    console.error("💥 Erro no servidor:", err);
    return res.status(500).json({ sucesso: false, erro: err.message });
  }
}
