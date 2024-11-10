const { request, response } = require("express");
const Users = require("../models/users-bv")

const existeUser = async(req=request, res=response, next) => {

  const { usuario } = req.body;

    const existe = await Users.findOne({ usuario })

      if(existe){
          return res.status(400).json({
            msg: `El usuario: ${usuario} ya se encuentra registrado`
          })

      }

      next()
}

module.exports = existeUser;