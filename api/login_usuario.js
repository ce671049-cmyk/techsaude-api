import { connectDB } from './db.js';

export default async function handler(req, res) {
  try {
    // Força o header de resposta como JSON SEMPRE
    res.setHeader('Content-Type', 'application/json');

    // Verifica método HTTP
    if (req.method !== 'POST') {
      return res.status(405).json({ sucesso: false, erro: 'Método não permitido' });
    }

    // Lê corpo da requisição com fallback de segurança
    let body = {};
    try {
      body = req.body || {};
      if (typeof body === 'string') body = JSON.parse(body);
    } catch (parseErr) {
      return res.status(400).json({ sucesso: false, erro: 'JSON inválido no corpo da requisição' });
    }

    const { cpfUsuario, senhaUsuario } = body;

    if (!cpfUsuario || !senhaUsuario) {
      return res.status(400).json({ sucesso: false, erro: 'CPF e senha são obrigatórios!' });
    }

    // Conecta ao banco
    const connection = await connectDB();

    const [rows] = await connection.execute(
      'SELECT * FROM TB_Usuario WHERE cpfUsuario = ? AND senhaUsuario = ?',
      [cpfUsuario, senhaUsuario]
    );

    await connection.end();

    if (rows.length > 0) {
      return res.status(200).json({
        sucesso: true,
        mensagem: 'Login realizado com sucesso!',
        usuario: rows[0],
      });
    } else {
      return res.status(401).json({ sucesso: false, erro: 'CPF ou senha inválidos!' });
    }
  } catch (erro) {
    console.error('💥 Erro no servidor:', erro);

    // 👇 Força o retorno JSON mesmo em erros inesperados
    try {
      res.status(500).json({
        sucesso: false,
        erro: erro.message || 'Erro interno do servidor',
      });
    } catch {
      // Se até isso falhar, ainda responde JSON “manual”
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ sucesso: false, erro: 'Erro fatal no servidor' }));
    }
  }
}
