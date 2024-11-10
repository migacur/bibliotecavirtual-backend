const { request, response } = require("express");

const validarLongitud = async(req=request, res=response, next) => {

  const { usuario } = req.body;

      if(!usuario){
        return res.status(400).json({
          msg: 'Debes agregar un nombre de usuario'
        })
      }

      if(usuario.length < 8){
        return res.status(400).json({
          msg: 'El usuario debe tener un mínimo de 8 carácteres'
        })
      }
     
     next()
}

module.exports = validarLongitud;