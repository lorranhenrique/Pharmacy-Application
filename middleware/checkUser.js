// middlewares/checkUserToken.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'né segredo';

const checkUser = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.redirect('/autentificar');
            } else if (decoded.cargo === 'Administrador') {
                return res.redirect('/funcionarios');
            }
        });
    } else {
        next();
    }
};

module.exports = checkUser;
