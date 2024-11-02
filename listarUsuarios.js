require('dotenv').config(); // Carrega as variáveis de ambiente
const mongoose = require('mongoose');
const Usuario = require('./models/usuario'); // Ajuste o caminho para o modelo 'Usuario'

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Conectado ao banco de dados para visualizar dados.");
    return Usuario.find(); // Consulta todos os documentos na coleção 'usuarios'
  })
  .then((usuarios) => {
    console.log("Usuários encontrados:", usuarios);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log("Erro ao consultar os dados:", err);
  });
