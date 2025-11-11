import { connectDB } from './db.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ sucesso: false, erro: 'Método não permitido' });
    }

    const { cpfUsuario, senhaUsuario } = req.body;

    if (!cpfUsuario || !senhaUsuario) {
      return res.status(400).json({ sucesso: false, erro: 'CPF e senha são obrigatórios!' });
    }

    // ✅ Usa a função que já faz o import do mysql
    const connection = await connectDB();

    const [rows] = await connection.execute(
      'SELECT * FROM TB_Usuario WHERE cpfUsuario = ? AND senhaUsuario = ?',
      [cpfUsuario, senhaUsuario]
    );

    await connection.end();

    if (rows.length > 0) {
      return res.status(200).json({ sucesso: true, mensagem: 'Login realizado com sucesso!' });
    } else {
      return res.status(401).json({ sucesso: false, erro: 'CPF ou senha inválidos!' });
    }

  } catch (erro) {
    console.error('💥 Erro no servidor:', erro);
    return res.status(500).json({ sucesso: false, erro: erro.message });
  }
}
