const jwt = require('jsonwebtoken')

const validarJWT = (req, res, next) => {

    // Leer el token
    const token = req.header('x-token')
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'Es necesario un token para continuar con la solicitud'
        })
    }


    try {

        const { uid } = jwt.verify(token, process.env.JWT_KEY);

        req.uid = uid;

        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }

}

module.exports = {
    validarJWT
}