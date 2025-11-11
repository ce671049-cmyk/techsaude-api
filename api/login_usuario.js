import { connection } from './db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ sucesso: false, erro: 'Método não permitido' });
  }

  try {
    const { cpfUsuario, senhaUsuario } = req.body;

    if (!cpfUsuario || !senhaUsuario) {
      return res.status(400).json({ sucesso: false, erro: 'Campos obrigatórios não enviados' });
    }

    const [rows] = await connection.query(
      'SELECT * FROM TB_Usuario WHERE cpfUsuario = ? AND senhaUsuario = ?',
      [cpfUsuario, senhaUsuario]
    );

    if (rows.length > 0) {
      res.status(200).json({ sucesso: true, usuario: rows[0] });
    } else {
      res.status(401).json({ sucesso: false, erro: 'CPF ou senha incorretos' });
    }
  } catch (error) {
    console.error('💥 Erro no servidor:', error);
    res.status(500).json({ sucesso: false, erro: error.message });
  }
}
