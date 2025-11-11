import mysql from "mysql2/promise";

async function insert() {
import { connectDB } from "/db.js";
  });

  const query = `
    INSERT INTO TB_Usuario (
      nome_completoUsuario, cpfUsuario, emailUsuario,
      data_nascUsuario, enderecoUsuario, sexoUsuario,
      senhaUsuario, telefoneUsuario
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    "Carlos Eduardo",
    "123.456.789-10",
    "carlos@gmail.com",
    "26/10/2006",
    "Rua Exemplo",
    "M",
    "123",
    "(11) 97777-1111",
  ];

  try {
    const [result] = await connection.execute(query, params);
    console.log("✅ Usuário inserido:", result);
  } catch (err) {
    console.error("❌ Erro no INSERT:", err);
  } finally {
    await connection.end();
  }
}

insert();
