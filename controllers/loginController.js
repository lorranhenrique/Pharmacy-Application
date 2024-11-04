const express = require('express');
const router = express.Router();
const Farmaco = require('../models/farmaco');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'né segredo';
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt'); 

const maxAge =  200*60 *50; 
const createToken = (id)=>{
    return jwt.sign({id},'segredo',{
        expiresIn: maxAge
    });
}

const login_post = async (req, res) => {
    const { login, senha } = req.body;

    try {
        const usuario = await Usuario.findOne({ nome: login });

        if (usuario) {
            const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
            
            if (senhaCorreta) {
                const token = createToken(usuario._id);
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge });
                res.redirect(`/storage?token=${token},user:${usuario}`);
            } else {
                res.status(401).redirect('/?error=senha_invalida');
            }
        } else {
            res.status(401).redirect('/?error=usuario_nao_encontrado');
        }
    } catch (err) {
        console.error('Erro ao processar login:', err);
        res.status(500).send('Erro no servidor.');
    }
};

const login_index = (req,res)=>{
    Usuario.find().sort({nome:1})
    .then((result)=>{
        res.render('login',{title: 'login', usuarios: result});
        
    })
    .catch((err)=>{
        console.log(err);
    })
    
}

module.exports = {
    login_index,
    login_post
}