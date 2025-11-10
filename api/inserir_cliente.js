// arquivo: api/inserir_cliente.js

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const body = await req.body;
      const { nome, telefone } = body;

      console.log("📩 Dados recebidos:", nome, telefone);

      // Simulação de salvamento (aqui você poderia conectar no banco)
      res.status(200).json({
        sucesso: true,
        mensagem: "Dados recebidos com sucesso!",
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

