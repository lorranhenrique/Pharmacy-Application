const Farmaco = require('../models/farmaco');
const Usuario = require('../models/usuario');

const user_index = (req,res)=>{
    Usuario.find().sort({nome:1})
        .then((result)=>{
            res.render('funcionarios',{title: 'Todos os Funcionarios', usuarios: result})
        })
        .catch((err)=>{
            console.log(err);
        })
}

const user_post = (req,res)=>{
    const usuario = new Usuario(req.body);
    usuario.save()
        .then((result)=>{
            res.redirect('/funcionarios');
        })
        .catch((err)=>{
            console.log(err);
        })
}

const bcrypt = require('bcrypt');

const user_put = async (req, res) => {
    const id = req.params.id;

    try {
        const updatedData = {
            nome: req.body.nome,
            cargo: req.body.cargo
        };
        if (req.body.senha) {
            const salt = await bcrypt.genSalt(10);
            updatedData.senha = await bcrypt.hash(req.body.senha, salt);
        }
        const result = await Usuario.findByIdAndUpdate(id, updatedData, { new: true });

        if (result) {
            res.json({ redirect: `/funcionarios` });
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (err) {
        console.error("Erro ao atualizar usuário:", err);
        res.status(500).json({ error: 'Erro ao atualizar Funcionário' });
    }
};

module.exports = { user_put };


const user_index_det = (req,res)=>{
    const id= req.params.id;
    Usuario.findById(id)
        .then((result)=>{
            res.render('detalhes-Funcionario',{usuarios: result,title: 'Gerenciando Funcionário'});
        })
        .catch((err)=>{
            console.log(err);
        })
}

const user_delete = (req, res) => {
    const id = req.params.id;

    Usuario.findById(id)
        .then(usuario => {
            if (usuario && usuario.nome === 'admin') {
                return res.status(403).json({ error: 'A exclusão do administrador é proibida.' });
            }
            return Usuario.findByIdAndDelete(id);
        })
        .then(result => {
            if (result) {
                res.json({ redirect: '/usuarios' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Erro ao excluir o usuário.' });
        });
};


module.exports = {
    user_delete,
    user_index,
    user_index_det,
    user_post,
    user_put
}