const Roles = require('../models/role-model');
const Usuario = require('../models/user-model');
const Categorias = require("../models/categoria-model");
const { response, request } = require('express');
const Producto = require('../models/producto-model');

const existeEmail = async(email = '') => {

    const existe = await Usuario.findOne({ email }).exec()

      if(existe){
       throw new Error(`El correo ${email}, ya se encuentra registrado`)
      }

}


const userConfirmation = async(user = '') => {

    const usuarios = await Usuario.findOne({ user }).exec()
    
    if(usuarios){
        throw new Error(`El usuario ${user} ya se encuentra registrado`)
    }

   
}

const sendEmail = async(email = '') => {
    const existe = await Usuario.findOne({ email }).exec()

    if(!existe){
     throw new Error(`El correo ingresado, no se encuentra registrado`)
    }
}

const rolExist = async(rol = '') =>{


   const isRolValid = await Roles.findOne({ rol }).exec()
  
    if( !isRolValid ){
        throw new Error(`El rol ${rol} no se encuentra en la BD`)
    }
   
}

const tieneRol = ( ...role ) => {

    return (req, res = response, next) => {

        if( !req.usuario ){
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            })
        }

        if( !role.includes( req.usuario.rol )){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${role}`
            })
        }

        next()
    }
     
}

const existeId = async(id = '') => {
    const buscarId = await Usuario.findById(id)

    if( !buscarId ){
        throw new Error(`El ${id} no existe`)
    }
}

const existeCategoriaId = async(id = '') => {

    const existe = await Categorias.findById( id )

    if(!existe){
        throw new Error(`No existe categoría con el id: ${id}`)
    }
}

const existeProductoId = async(id = '') => {

    const existe = await Producto.findById( id )

    if(!existe){
        throw new Error(`No existe producto con el id: ${id}`)
    }
}


module.exports = {
    existeEmail,
    userConfirmation,
    sendEmail,
    rolExist,
    tieneRol,
    existeId,
    existeCategoriaId,
    existeProductoId
}