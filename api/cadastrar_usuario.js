// api/cadastrar_usuario.js
import { connectDB } from "./db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  const {
    nome_completoUsuario,
    cpfUsuario,
    emailUsuario,
    data_nascUsuario,
    enderecoUsuario,
    sexoUsuario,
    senhaUsuario,
    telefoneUsuario,
  } = req.body;

  if (
    !nome_completoUsuario ||
    !cpfUsuario ||
    !emailUsuario ||
    !data_nascUsuario ||
    !enderecoUsuario ||
    !sexoUsuario ||
    !senhaUsuario ||
    !telefoneUsuario
  ) {
    return res.status(400).json({ sucesso: false, erro: "Campos obrigatórios faltando" });
  }

  try {
    const db = await connectDB();

    const query = `
      INSERT INTO TB_Usuario (
        nome_completoUsuario, cpfUsuario, emailUsuario,
        data_nascUsuario, enderecoUsuario, sexoUsuario,
        senhaUsuario, telefoneUsuario
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
      nome_completoUsuario,
      cpfUsuario,
      emailUsuario,
      data_nascUsuario,
      enderecoUsuario,
      sexoUsuario,
      senhaUsuario,
      telefoneUsuario,
    ]);

    await db.end();

    return res.status(200).json({ sucesso: true, mensagem: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    console.error("❌ Erro no servidor:", err.message);
    return res.status(500).json({ sucesso: false, erro: err.message });
  }
}
