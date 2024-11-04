const Farmaco = require('../models/farmaco');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'né segredo';
const bcrypt = require('bcrypt'); 

const auth_post = async (req,res)=>{
    const { login, senha } = req.body;
    
    try {
        const usuario = await Usuario.findOne({ nome: login });

        if(usuario){
            const senhaCorreta = await bcrypt.compare(senha,usuario.senha);
            
            if(senhaCorreta&&usuario.cargo==="Administrador"){
                const token = jwt.sign({ cargo: usuario.cargo }, SECRET_KEY, { expiresIn: '1h' });
                res.redirect(`/funcionarios?token=${token}`);
            } else {
                res.status(401).redirect('/autentificar?error=senha_invalida');
            }
        }
    }catch (err) {
        console.error('Erro ao processar login:', err);
        res.status(500).send('Erro no servidor.');
    }
}

module.exports = {
    auth_post
}