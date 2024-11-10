const { request, response } = require("express");
const Users = require("../models/users-bv")

const existeEmailBv = async(req=request, res=response, next) => {

  const { email } = req.body;

    const existeEmail = await Users.findOne({ email })

      if(existeEmail){
          return res.status(400).json({
            msg: 'El email ya se encuentra registrado'
          })

      }

      next()
}

module.exports = existeEmailBv;