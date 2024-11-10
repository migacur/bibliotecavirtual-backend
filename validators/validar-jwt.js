const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const Users = require("../models/users-bv");

const validarJWT = async(req = request, res = response, next) => {

   const token = req.header('Authorization');

    if( !token ){
        return res.status(401).json({
            msg: 'No hay token disponible'
        });
    }


    try {

        const {uid, name} = jwt.verify(
            token, 
            process.env.SECRET_KEY 
            )
       
        req.uid = uid;
        req.usuario = name;

      
        const usuario = await Users.findById( uid )

        if(!token){
            return res.status(401).json({
            msg: 'Token no válido, usuario no encontrado'
            })
        }


        if( !usuario.state ){
            return res.status(401).json({
                msg: 'Token no válido/activo'
            })
        }
        
       
        next()

    } catch (error) {
        console.log(error)

        res.status(401).json({
            msg: 'Token no válido'
        })
    }
}

module.exports = {
    validarJWT
}