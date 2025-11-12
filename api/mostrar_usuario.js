import { connectDB } from './db.js';

export default async function handler(req, res) {
  try {
    res.setHeader('Content-Type', 'application/json');

    // Permite apenas método POST
    if (req.method !== 'POST') {
      return res.status(405).json({ sucesso: false, erro: 'Método não permitido' });
    }

    // Lê o corpo da requisição
    let body = {};
    try {
      body = req.body || {};
      if (typeof body === 'string') body = JSON.parse(body);
    } catch (err) {
      return res.status(400).json({ sucesso: false, erro: 'JSON inválido no corpo da requisição' });
    }

    const { idUsuario } = body;

    if (!idUsuario) {
      return res.status(400).json({ sucesso: false, erro: 'ID do usuário é obrigatório!' });
    }

    // Conecta ao banco
    const connection = await connectDB();

    // Busca o usuário pelo ID
    const [rows] = await connection.execute(
      'SELECT idUsuario, nomeUsuario, cpfUsuario, emailUsuario, telefoneUsuario, enderecoUsuario, dataNascimentoUsuario, sexoUsuario FROM TB_Usuario WHERE idUsuario = ?',
      [idUsuario]
    );

    await connection.end();

    if (rows.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Usuário não encontrado!' });
    }

    // Retorna os dados do usuário
    return res.status(200).json({
      sucesso: true,
      usuario: rows[0],
    });

  } catch (erro) {
    console.error('💥 Erro no servidor:', erro);
    return res.status(500).json({
      sucesso: false,
      erro: erro.message || 'Erro interno do servidor',
    });
  }
}
