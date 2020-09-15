const { response } = require("express");
const bcrypt = require('bcryptjs')

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/jwt");
const usuario = require("../models/usuario");

const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ingresado ya esta registrado'
            })
        }

        const usuario = new Usuario(req.body);

        // Encriptamos la contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt)

        await usuario.save();

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        const usuarioDB = await usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario o contraseña incorrecta'
            })
        }

        // Validar el password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña o usuario incorrecto'
            })
        }

        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const renewToken = async(req, res = response) => {

    const uid = req.uid;

    if (!uid) {
        return res.status(400).json({
            ok: false,
            msg: 'Ocurrio un error inesperado vuelva a intentarlo'
        })
    }

    const token = await generarJWT(uid)

    if (!token) {
        return res.status(400).json({
            ok: false,
            msg: 'Ocurrio un error inesperado vuelva a intentarlo'
        })
    }

    const usuarioDB = await usuario.findById(uid);
    if (!usuarioDB) {
        return res.status(400).json({
            ok: false,
            msg: 'Usuario no encontrado'
        })
    }

    res.json({
        ok: true,
        usuario: usuarioDB,
        token
    })
}

module.exports = {
    crearUsuario,
    login,
    renewToken
}