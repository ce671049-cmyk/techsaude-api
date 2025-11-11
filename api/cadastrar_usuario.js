// api/cadastrar_usuario.js
import { connectDB } from "./db.js";

// 🔹 Função para converter data de DD/MM/YYYY → YYYY-MM-DD
function formatarData(dataBr) {
  try {
    if (!dataBr || typeof dataBr !== "string") return dataBr;
    if (dataBr.includes("/")) {
      const [dia, mes, ano] = dataBr.split("/");
      if (dia && mes && ano) return `${ano}-${mes}-${dia}`;
    }
    return dataBr; // já está no formato certo
  } catch (err) {
    console.error("Erro ao formatar data:", err);
    return dataBr;
  }
}

export default async function handler(req, res) {
  try {
    // 🔹 Aceita apenas POST
    if (req.method !== "POST") {
      return res.status(405).json({ erro: "Método não permitido" });
    }

    // 🔹 Força conversão de texto para JSON
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (err) {
        console.error("❌ Erro ao converter body:", err);
        return res.status(400).json({ erro: "Formato inválido de JSON" });
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

    // 🔹 Corrige o formato da data
    const dataFormatada = formatarData(data_nascUsuario);

    console.log("📦 Dados recebidos:", {
      nome_completoUsuario,
      cpfUsuario,
      emailUsuario,
      dataFormatada,
      enderecoUsuario,
      sexoUsuario,
      senhaUsuario,
      telefoneUsuario,
    });

    // 🔹 Conecta ao banco
    const db = await connectDB();

    // 🔹 Executa o INSERT
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
      dataFormatada,
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
