const Users = require("../models/users-bv")

const comprobarUser = async() => {
    
    const existeUsuario = await Users.findOne({ usuario })

      if(!existeUsuario){
       return res.json({
        msg: `El usuario: ${usuario} no se encuentra registrado`
       })
      }

}

module.exports = comprobarUser