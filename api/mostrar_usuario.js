import express from "express";
import { connectDB } from "./db.js"; // seu arquivo de conexão

const app = express();
app.use(express.json()); // para ler JSON do body

// Endpoint POST para buscar usuário pelo CPF
app.post("/mostrar_usuario", async (req, res) => {
  try {
    const { cpfUsuario } = req.body;

    if (!cpfUsuario) {
      return res.status(400).json({ sucesso: false, erro: "CPF não informado" });
    }

    // Conectar ao banco MySQL
    const conn = await connectDB();

    // Buscar usuário pelo CPF
    const [rows] = await conn.execute(
      `SELECT nome, cpf, email, nascimento, endereco, telefone, sexo 
       FROM usuarios 
       WHERE cpf = ?`,
      [cpfUsuario]
    );

    await conn.end();

    if (rows.length === 0) {
      return res.json({ sucesso: false, erro: "Usuário não encontrado" });
    }

    // Retornar os dados do usuário
    res.json({ sucesso: true, usuario: rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ sucesso: false, erro: "Erro no servidor" });
  }
});

// Definir porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
