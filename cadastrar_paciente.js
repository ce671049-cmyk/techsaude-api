import { connectDB } from "./db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
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
  } = req.body;

  // Validação básica
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

  try {
    const connection = await mysql.createConnection({
      host: "SEU_HOST",
      user: "SEU_USUARIO",
      password: "SUA_SENHA",
      database: "SEU_BANCO",
      ssl: { rejectUnauthorized: true },
    });

    const query = `
      INSERT INTO TB_Usuario (
        nome_completoUsuario, cpfUsuario, emailUsuario,
        data_nascUsuario, enderecoUsuario, sexoUsuario,
        senhaUsuario, telefoneUsuario
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await connection.execute(query, [
      nome_completoUsuario,
      cpfUsuario,
      emailUsuario,
      data_nascUsuario,
      enderecoUsuario,
      sexoUsuario,
      senhaUsuario,
      telefoneUsuario,
    ]);

    await connection.end();

    return res.status(200).json({ sucesso: true, mensagem: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    console.error("Erro no servidor:", err);
    return res.status(500).json({ sucesso: false, erro: err.message });
  }
}

