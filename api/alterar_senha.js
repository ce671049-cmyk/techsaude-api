import { connectDB } from "./db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ sucesso: false, erro: "Método não permitido" });
  }

  const { cpfUsuario, novaSenha } = req.body;

  if (!cpfUsuario || !novaSenha) {
    return res.status(400).json({ sucesso: false, erro: "CPF e nova senha são obrigatórios!" });
  }

  try {
    const db = await connectDB();


    const [result] = await db.execute(
      "UPDATE TB_Usuario SET senhaUsuario = ? WHERE cpfUsuario = ?",
      [novaSenha, cpfUsuario]
    );

    await db.end();

    if (result.affectedRows > 0) {
      return res.status(200).json({
        sucesso: true,
        mensagem: "Senha atualizada com sucesso!"
      });
    } else {
      return res.status(404).json({
        sucesso: false,
        erro: "Usuário não encontrado!"
      });
    }
  } catch (erro) {
    console.error("Erro ao atualizar senha:", erro);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno no servidor: " + erro.message
    });
  }
}
