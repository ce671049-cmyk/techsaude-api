// api/cadastrar_usuario.js
import { connectDB } from "./db.js";

export default async function handler(req, res) {
  try {
    // 🔹 Aceita apenas POST
    if (req.method !== "POST") {
      return res.status(405).json({ erro: "Método não permitido" });
    }

    // 🔹 Força o corpo a virar JSON mesmo se vier como texto
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (err) {
        console.error("❌ Erro ao converter body:", err);
        return res.status(400).json({ erro: "Formato inválido de JSON" });
      }
    }

    // 🔹 Extrai os campos
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

    // 🔹 Validação simples
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
      return res.status(400).json({ erro: "Campos obrigatórios faltando" });
    }

    console.log("📦 Dados recebidos (JSON):", body);

    // 🔹 Conecta ao banco
    const db = await connectDB();

    // 🔹 Query SQL
    const query = `
      INSERT INTO TB_Usuario (
        nome_completoUsuario, cpfUsuario, emailUsuario,
        data_nascUsuario, enderecoUsuario, sexoUsuario,
        senhaUsuario, telefoneUsuario
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // 🔹 Executa o INSERT
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

    console.log("✅ Inserção concluída:", result);
    await db.end();

    return res.status(200).json({
      sucesso: true,
      mensagem: "Usuário cadastrado com sucesso!",
    });

  } catch (err) {
    console.error("💥 Erro no servidor:", err);
    return res.status(500).json({
      sucesso: false,
      erro: err.message || "Erro interno no servidor",
    });
  }
}
