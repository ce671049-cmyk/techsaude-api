import { connect } from "./db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ sucesso: false, erro: "Método não permitido" });
  }

  try {
    const { cpfUsuario, senhaUsuario } = req.body;

    if (!cpfUsuario || !senhaUsuario) {
      return res.status(400).json({ sucesso: false, erro: "Campos obrigatórios ausentes" });
    }

    const connection = await connect();

    // 🔹 QUERY CORRETA — parâmetros dentro de array
    const [rows] = await connection.query(
      "SELECT * FROM TB_Usuario WHERE cpfUsuario = ? AND senhaUsuario = ?",
      [cpfUsuario, senhaUsuario]
    );

    connection.end();

    if (rows.length > 0) {
      return res.status(200).json({ sucesso: true, usuario: rows[0] });
    } else {
      return res.status(401).json({ sucesso: false, erro: "CPF ou senha inválidos" });
    }

  } catch (erro) {
    console.error("💥 Erro no servidor:", erro);
    return res.status(500).json({ sucesso: false, erro: erro.message });
  }
}
