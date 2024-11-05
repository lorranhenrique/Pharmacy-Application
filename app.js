const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const bcrypt = require('bcrypt');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

const Usuario = require('./models/usuario');
const rotasLogin = require('./routes/rotasLogin');
const rotasUsuarios = require('./routes/rotasUsuarios');
const rotasFarmacos = require('./routes/rotasFarmacos');
const rotasAutentificar = require('./routes/rotasAutentificar');
const rotasLogout = require('./routes/rotasLogout');
const rotasRedirecionamento = require('./routes/rotasRedirecionamento');
const rotas404 = require('./routes/rotas404');


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(morgan('dev'));

const dbURI = process.env.MONGO_URI; //URI aqui
let globalSession;


mongoose.connect(dbURI)
    .then(async () => {
        globalSession = await mongoose.startSession();
        globalSession.startTransaction();

        app.listen(3000);
    })
    .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));


const resetDatabase = async () => {
    console.log("Resetando o banco de dados...");

    try {
        // Apaga todos os documentos de todas as coleções
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }

        await Usuario.create({
            nome: 'admin',
            senha: "000",
            cargo: 'Administrador'
        });

        console.log("Banco de dados resetado e administrador recriado.");
    } catch (err) {
        console.error("Erro ao resetar o banco de dados:", err);
    }
};

process.on('SIGINT', async () => {
    try {
        await resetDatabase();
        await globalSession.abortTransaction(); // Reverte todas as transações
        await globalSession.endSession();

        await mongoose.connection.close(); // Remove o callback e apenas espera a Promise

        console.log("Conexão com o MongoDB encerrada.");
        process.exit(0);
    } catch (err) {
        console.error("Erro ao encerrar a conexão com o MongoDB:", err);
        process.exit(1);
    }
});

process.on('uncaughtException', async (err) => {
    console.error("Exceção não tratada:", err);
    await resetDatabaseOnExit();
    process.exit(1);
});


app.use(rotasLogin);
app.use(rotasAutentificar);
app.use(rotasLogout);
app.use(rotasUsuarios);
app.use(rotasFarmacos);
app.use(rotasRedirecionamento);
app.use(rotas404);


app.get('/set-cookies', (req, res) => {
    res.cookie('novoUsuario', false);
    res.cookie('Empregado', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: true });
    res.send('Você está com biscoitos');
});

app.get('/read-cookies', (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
    res.json(cookies);
});

