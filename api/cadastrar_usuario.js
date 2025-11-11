import { connectDB } from "./db.js";

export default async function handler(req, res) {
  try {
    // 🔹 Permite apenas POST
    if (req.method !== "POST") {
      return res.status(405).json({ sucesso: false, erro: "Método não permitido" });
    }

    // 🔹 Força a leitura manual do corpo
    let bodyData = "";
    await new Promise((resolve, reject) => {
      req.on("data", chunk => bodyData += chunk);
      req.on("end", resolve);
      req.on("error", reject);
    });

    // 🔹 Tenta converter o body em JSON
    let body;
    try {
      body = JSON.parse(bodyData);
    } catch (err) {
      console.error("❌ Body inválido:", bodyData);
      return res.status(400).json({ sucesso: false, erro: "JSON inválido recebido" });
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

    // 🔹 Verificação simples
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

    console.log("📥 Dados recebidos:", body);

    // 🔹 Conecta ao banco
    const db = await connectDB();

    const query = `
      INSERT INTO TB_Usuario (
        nome_completoUsuario, cpfUsuario, emailUsuario,
        data_nascUsuario, enderecoUsuario, sexoUsuario,
        senhaUsuario, telefoneUsuario
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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

    console.log("✅ Usuário cadastrado com sucesso!");
    return res.status(200).json({ sucesso: true, mensagem: "Usuário cadastrado com sucesso!" });

  } catch (err) {
    console.error("💥 Erro no servidor:", err);
    return res.status(500).json({
      sucesso: false,
      erro: err.message || "Erro interno no servidor"
    });
  }
}
