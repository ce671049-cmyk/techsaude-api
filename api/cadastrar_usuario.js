import { connectDB } from "./db.js";

export default async function handler(req, res) {
  try {
    // 🔹 Permite apenas POST
    if (req.method !== "POST") {
      return res.status(405).json({ sucesso: false, erro: "Método não permitido" });
    }

    // 🔹 Lê o corpo manualmente (porque o Vercel às vezes não faz o parse automático)
    let bodyData = "";
    await new Promise((resolve, reject) => {
      req.on("data", chunk => (bodyData += chunk));
      req.on("end", resolve);
      req.on("error", reject);
    });

    // 🔹 Converte o corpo para JSON
    let body;
    try {
      body = JSON.parse(bodyData);
    } catch (err) {
      console.error("❌ Body inválido recebido:", bodyData);
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

    // 🔹 Valida campos obrigatórios
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

    // 🔹 Converte a data "DD/MM/YYYY" → "YYYY-MM-DD"
    function converterDataParaMySQL(data) {
      // Ignora se já estiver no formato certo
      if (data.includes("-")) return data;
      const partes = data.split("/");
      if (partes.length !== 3) return null;
      const [dia, mes, ano] = partes;
      return `${ano}-${mes}-${dia}`;
    }

    const dataConvertida = converterDataParaMySQL(data_nascUsuario);
    if (!dataConvertida) {
      return res.status(400).json({ sucesso: false, erro: "Formato de data inválido" });
    }

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
      dataConvertida, // ✅ agora está no formato certo
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
      erro: err.message || "Erro interno no servidor",
    });
  }
}
