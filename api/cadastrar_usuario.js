// api/cadastrar_usuario.js
import { connectDB } from "./db.js";


export default async function handler(req, res) {
  try {
    if (req.method !== "POST")
      return res.status(405).json({ erro: "Método não permitido" });

    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ erro: "JSON inválido" });
      }
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
    } = body;

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
      return res
        .status(400)
        .json({ sucesso: false, erro: "Campos obrigatórios faltando" });
    }

    // 🔹 Formatar data corretamente
    const dataFormatada = formatarData(data_nascUsuario);
    if (!dataFormatada) {
      return res.status(400).json({
        sucesso: false,
        erro: "Data de nascimento inválida. Use DD/MM/AAAA.",
      });
    }

    const db = await connectDB();

    const query = `
      INSERT INTO TB_Usuario (
        nome_completoUsuario, cpfUsuario, emailUsuario,
        data_nascUsuario, enderecoUsuario, sexoUsuario,
        senhaUsuario, telefoneUsuario
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      nome_completoUsuario.trim(),
      cpfUsuario.trim(),
      emailUsuario.trim(),
      dataFormatada,
      enderecoUsuario.trim(),
      sexoUsuario.trim(),
      senhaUsuario.trim(),
      telefoneUsuario.trim(),
    ];

    const [result] = await db.execute(query, values);
    await db.end();

    console.log("✅ Usuário inserido:", result);
    return res
      .status(200)
      .json({ sucesso: true, mensagem: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    console.error("💥 Erro no servidor:", err);
    return res
      .status(500)
      .json({ sucesso: false, erro: err.message || "Erro interno" });
  }
}
