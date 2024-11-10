const { request, response } = require("express");
const Users = require("../models/users-bv");
const Roles = require("../models/role-model");

const validarRoleBv = async(req = request, res=response, next) => {
    
  try {
    const user = await Users.findById({_id: req.payload.id});
    const role = await Roles.findOne({rol: user.rol});

    if(!user){
      return res.status(403).json({ msg: 'Usuario no encontrado' });
    }

    if (role.rol === 'ADMIN_ROLE') {
      next();
    } else {
      return res.status(403).json({ msg: 'No eres Administrador' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal Server Error' });
  }

}

module.exports = validarRoleBv