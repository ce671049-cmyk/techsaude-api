import { connectDB } from "./db.js";

export default async function handler(req, res) {
  try {
    // 🔹 Permite apenas POST
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ sucesso: false, erro: "Método não permitido" });
    }

    // 🔹 Leitura manual do corpo
    let bodyData = "";
    await new Promise((resolve, reject) => {
      req.on("data", (chunk) => (bodyData += chunk));
      req.on("end", resolve);
      req.on("error", reject);
    });

    // 🔹 Converte JSON recebido
    let body;
    try {
      body = JSON.parse(bodyData);
    } catch (err) {
      console.error("❌ JSON inválido recebido:", bodyData);
      return res
        .status(400)
        .json({ sucesso: false, erro: "Formato JSON inválido" });
    }

    // 🔹 Extrai os campos esperados
    const {
      nome_completoMedico,
      crmMedico,
      cpfMedico,
      emailMedico,
      data_nascMedico,
      sexoMedico,
      especialidadeMedico,
      senhaMedico,
      telefoneMedico,
    } = body;

    // 🔹 Validação básica
    if (
      !nome_completoMedico ||
      !crmMedico ||
      !cpfMedico ||
      !emailMedico ||
      !data_nascMedico ||
      !sexoMedico ||
      !especialidadeMedico ||
      !senhaMedico ||
      !telefoneMedico
    ) {
      return res
        .status(400)
        .json({ sucesso: false, erro: "Campos obrigatórios faltando." });
    }

    console.log("📥 Dados recebidos:", body);

    // 🔹 Função para normalizar a data (aceita ISO ou DD/MM/AAAA)
    function normalizarData(data) {
      if (data.includes("T")) return data.split("T")[0]; // Ex: 2006-10-26
      if (data.includes("/", "\")) {
        const [dia, mes, ano] = data.split("/");
        return `${ano}-${mes}-${dia}`;
      }
      return data; // já no formato correto
    }

    const dataFormatada = normalizarData(data_nascMedico);

    // 🔹 Conecta ao banco
    const db = await connectDB();

    const query = `
      INSERT INTO TB_Medico (
        nome_completoMedico,
        crmMedico,
        cpfMedico,
        emailMedico,
        data_nascMedico,
        sexoMedico,
        especialidadeMedico,
        senhaMedico,
        telefoneMedico
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
      nome_completoMedico,
      crmMedico,
      cpfMedico,
      emailMedico,
      dataFormatada,
      sexoMedico,
      especialidadeMedico,
      senhaMedico,
      telefoneMedico,
    ]);

    await db.end();

    console.log("✅ Médico cadastrado com sucesso!");
    return res
      .status(200)
      .json({ sucesso: true, mensagem: "Médico cadastrado com sucesso!" });
  } catch (err) {
    console.error("💥 Erro no servidor:", err);
    return res.status(500).json({
      sucesso: false,
      erro: err.message || "Erro interno no servidor",
    });
  }
}
