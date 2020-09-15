const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = {
            uid
        };

        jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn: '24h'
        }, (err, token) => {
            if (err) {
                // no se pudo crear el Token
                reject('No se pudo generar el JWT')
            } else {
                // se genero exitosamente el token
                resolve(token)
            }
        });
    });
}

module.exports = {
    generarJWT
}