import { connectDB } from "./db.js";

export default async function handler(req, res) {
  try {
    // Aceita apenas POST
    if (req.method !== "POST") {
      return res.status(405).json({ erro: "Método não permitido" });
    }

    let body = req.body;

    // 🔹 Garante que o body seja um objeto JSON
    if (typeof body !== "object") {
      try {
        const text = await req.text();
        body = JSON.parse(text);
      } catch (err) {
        console.error("❌ Erro ao converter body:", err);
        return res.status(400).json({ erro: "Body inválido (não é JSON)" });
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

    // 🔹 Validação
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

    // 🔹 Conecta ao banco
    const db = await connectDB();

    // 🔹 Executa o INSERT direto (sem formatar a data)
    const query = `
      INSERT INTO TB_Usuario (
        nome_completoUsuario, cpfUsuario, emailUsuario,
        data_nascUsuario, enderecoUsuario, sexoUsuario,
        senhaUsuario, telefoneUsuario
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
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

    console.log("✅ Usuário cadastrado:", result);
    return res
      .status(200)
      .json({ sucesso: true, mensagem: "Usuário cadastrado com sucesso!" });

  } catch (err) {
    console.error("💥 Erro no servidor:", err);
    return res
      .status(500)
      .json({ sucesso: false, erro: err.message || "Erro interno no servidor" });
  }
}
