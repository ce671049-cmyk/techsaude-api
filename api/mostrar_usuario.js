// mostrar_usuario.js
import { connectDB } from './db.js'; // ajuste o caminho se necessário

const router = express.Router();

// POST /api/mostrar_usuario
router.post('/', async (req, res) => {
  try {
    const { cpf } = req.body;

    if (!cpf) {
      return res.status(400).json({ sucesso: false, erro: 'CPF não informado' });
    }

    const conn = await connectDB();

    // Busca o usuário pelo CPF
    const [rows] = await conn.execute(
      'SELECT nome, cpf, email, telefone, endereco, nascimento, sexo FROM usuarios WHERE cpf = ?',
      [cpf]
    );

    await conn.end();

    if (rows.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Usuário não encontrado' });
    }

    // Retorna os dados do usuário
    res.json({
      sucesso: true,
      usuario: rows[0] // row[0] já tem os campos nome, cpf, email, etc.
    });
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
  }
});

export default router;
