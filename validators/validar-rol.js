const { request, response } = require("express");

const esRolAdmin = (req = request, res = response, next) => {

    if( !req.usuario ){
        return res.status(500).json({
            msg: 'Hay que validar el token primero antes de verificar el rol'
        })
    }

    const { rol, user } = req.usuario 
    console.log(req.usuario)
    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${ user } no autorizado, debe ser administrador`
        })
    }

    next()
}

module.exports = {
    esRolAdmin
}