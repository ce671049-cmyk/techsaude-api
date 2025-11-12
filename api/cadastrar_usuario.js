import { connectDB } from "./db.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ sucesso: false, erro: "Método não permitido" });
    }

    // 🔹 Lê o corpo manualmente
    let bodyData = "";
    await new Promise((resolve, reject) => {
      req.on("data", chunk => (bodyData += chunk));
      req.on("end", resolve);
      req.on("error", reject);
    });

    let body;
    try {
      body = JSON.parse(bodyData);
    } catch (err) {
      console.error("❌ Body inválido recebido:", bodyData);
      return res.status(400).json({ sucesso: false, erro: "JSON inválido recebido" });
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
      return res.status(400).json({ sucesso: false, erro: "Campos obrigatórios faltando" });
    }

    console.log("📥 Dados recebidos:", body);

    // 🔹 Função para normalizar a data
    function normalizarData(data) {
      // Caso venha no formato ISO (ex: 2006-10-26T00:00:00.000Z)
      if (data.includes("T")) {
        return data.split("T")[0]; // → "2006-10-26"
      }

      // Caso venha no formato brasileiro (26/10/2006)
      if (data.includes("/")) {
        const [dia, mes, ano] = data.split("/");
        return `${ano}-${mes}-${dia}`;
      }

      // Já está no formato correto
      return data;
    }

    const dataFormatada = normalizarData(data_nascUsuario);

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
      dataFormatada, // ✅ data já normalizada
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
