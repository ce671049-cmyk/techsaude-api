// api/cadastrar_usuario.js
import { connectDB } from "./db.js";

// 🔹 Função para converter data de DD/MM/YYYY → YYYY-MM-DD
function formatarData(dataBr) {
  try {
    if (!dataBr || typeof dataBr !== "string") return dataBr;
    if (dataBr.includes("/")) {
      const [dia, mes, ano] = dataBr.split("/");
      return `${ano}-${mes}-${dia}`;
    }
    return dataBr;
  } catch (err) {
    console.error("Erro ao formatar data:", err);
    return dataBr;
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ erro: "Método não permitido" });
    }

    // 🔹 Força conversão de string → JSON
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (err) {
        console.error("❌ Erro ao converter body:", err);
        return res.status(400).json({ erro: "Formato inválido de JSON" });
      }
    }

    // 🔹 Extrai dados
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
      return res.status(400).json({
        sucesso: false,
        erro: "Campos obrigatórios faltando",
      });
    }

    // 🔹 Formata data corretamente
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

    // 🔹 Conecta no banco
    const db = await connectDB();

    // 🔹 Executa o INSERT
    const query = `
      INSERT INTO TB_Usuario (
        nome_completoUsuario, cpfUsuario, emailUsuario,
        data_nascUsuario, enderecoUsuario, sexoUsuario,
        senhaUsuario, telefoneUsuario
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      String(nome_completoUsuario),
      String(cpfUsuario),
      String(emailUsuario),
      String(dataFormatada),
      String(enderecoUsuario),
      String(sexoUsuario),
      String(senhaUsuario),
      String(telefoneUsuario),
    ];

    const [result] = await db.execute(query, values);

    await db.end();

    console.log("✅ Usuário cadastrado com sucesso:", result);
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
