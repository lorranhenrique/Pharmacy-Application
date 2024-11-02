require('dotenv').config(); // Carrega as variáveis de ambiente
const mongoose = require('mongoose');
const Usuario = require('./models/usuario'); // Ajuste o caminho para o modelo 'Usuario'

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Conectado ao banco de dados para inserir o usuário administrador.");
    seedAdmin();
  })
  .catch((err) => console.log("Erro de conexão:", err));

// Função para gerar e salvar apenas o usuário administrador fixo
async function seedAdmin() {
  const adminUser = {
    nome: 'admin',
    senha: '000',
    cargo: 'Administrador'
  };

  try {
    // Insere o usuário administrador no banco
    await Usuario.create(adminUser);
    console.log("Usuário administrador inserido com sucesso!");
  } catch (error) {
    console.log("Erro ao inserir usuário administrador:", error);
  } finally {
    mongoose.connection.close(); // Fecha a conexão com o banco após inserção
  }
}
