import { config } from './db.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ sucesso: false, erro: 'Método não permitido' });
    }

    // 🔹 Garantir leitura correta do corpo da requisição
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const bodyString = Buffer.concat(buffers).toString();
    const body = JSON.parse(bodyString);

    const { cpfUsuario, senhaUsuario } = body;

    if (!cpfUsuario || !senhaUsuario) {
      return res.status(400).json({ sucesso: false, erro: 'CPF e senha são obrigatórios!' });
    }

    const connection = await mysql.createConnection(config);

    const [rows] = await connection.execute(
      'SELECT * FROM TB_Usuario WHERE cpfUsuario = ? AND senhaUsuario = ?',
      [cpfUsuario, senhaUsuario]
    );

    await connection.end();

    if (rows.length > 0) {
      res.status(200).json({ sucesso: true, mensagem: 'Login realizado com sucesso!' });
    } else {
      res.status(401).json({ sucesso: false, erro: 'CPF ou senha inválidos!' });
    }

  } catch (erro) {
    console.error('💥 Erro no servidor:', erro);
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}
