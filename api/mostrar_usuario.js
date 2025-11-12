import { connectDB } from './db.js';

export default async function handler(req, res) {
  try {
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'POST') {
      return res.status(405).json({ sucesso: false, erro: 'Método não permitido' });
    }

    let body = {};
    try {
      body = req.body || {};
      if (typeof body === 'string') body = JSON.parse(body);
    } catch (parseErr) {
      return res.status(400).json({ sucesso: false, erro: 'JSON inválido' });
    }

    const { cpfUsuario } = body;

    if (!cpfUsuario) {
      return res.status(400).json({ sucesso: false, erro: 'CPF é obrigatório!' });
    }

    const connection = await connectDB();

    // 🔹 Busca o usuário pelo CPF
    const [rows] = await connection.execute(
      'SELECT nomeUsuario, cpfUsuario, emailUsuario, dataNascimentoUsuario, enderecoUsuario, telefoneUsuario, sexoUsuario FROM TB_Usuario WHERE cpfUsuario = ?',
      [cpfUsuario]
    );

    await connection.end();

    if (rows.length > 0) {
      return res.status(200).json({
        sucesso: true,
        usuario: rows[0],
      });
    } else {
      return res.status(404).json({ sucesso: false, erro: 'Usuário não encontrado!' });
    }
  } catch (erro) {
    console.error('💥 Erro no servidor:', erro);
    return res.status(500).json({
      sucesso: false,
      erro: erro.message || 'Erro interno no servidor',
    });
  }
}
