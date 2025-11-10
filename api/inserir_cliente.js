import { connectDB } from "./db.js";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      // 🧩 Ler o corpo manualmente
      let body = "";
      await new Promise((resolve, reject) => {
        req.on("data", chunk => {
          body += chunk;
        });
        req.on("end", resolve);
        req.on("error", reject);
      });

      // 🧩 Converter o corpo em JSON
      let data;
      try {
        data = JSON.parse(body);
      } catch (err) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "JSON inválido recebido",
          erro: err.message,
        });
      }

      const { nome, telefone } = data;

      // 🧠 Verificação simples
      if (!nome || !telefone) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Campos obrigatórios ausentes (nome, telefone)",
        });
      }

      console.log("📩 Dados recebidos:", nome, telefone);

      // 🔹 Conectar ao banco
      const conn = await connectDB();

      // 🔹 Inserir no banco
      const sql = "INSERT INTO clientes (nome, telefone) VALUES (?, ?)";
      await conn.execute(sql, [nome, telefone]);

      // 🔹 Fechar conexão
      await conn.end();

      // 🔹 Resposta de sucesso
      res.status(200).json({
        sucesso: true,
        mensagem: "Cliente inserido com sucesso!",
        dados: { nome, telefone },
      });

    } else {
      res.status(405).json({
        sucesso: false,
        mensagem: "Método não permitido",
      });
    }

  } catch (error) {
    console.error("❌ Erro no servidor:", error);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro interno no servidor",
      erro: error.message,
    });
  }
}
