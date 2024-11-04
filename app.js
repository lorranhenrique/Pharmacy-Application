const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const bcrypt = require('bcrypt');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const Usuario = require('./models/usuario');
const rotasLogin = require('./routes/rotasLogin');
const rotasUsuarios = require('./routes/rotasUsuarios');
const rotasFarmacos = require('./routes/rotasFarmacos');
const rotasAutentificar = require('./routes/rotasAutentificar');
const rotasLogout = require('./routes/rotasLogout');
const rotasRedirecionamento = require('./routes/rotasRedirecionamento');
const rotas404 = require('./routes/rotas404');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(morgan('dev'));

const dbURI = process.env.MONGO_URI; 
mongoose.connect(dbURI)
    .then((result)=>app.listen(3000))
    .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));
    
app.use(rotasLogin);
app.use(rotasAutentificar);
app.use(rotasLogout);
app.use(rotasUsuarios);
app.use(rotasFarmacos);
app.use(rotasRedirecionamento);
app.use(rotas404);

// Rotas de manipulação de cookies para teste
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
