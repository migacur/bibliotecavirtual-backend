const { response } = require('express');
const { request } = require('express');
const Usuario = require('../models/user-model');
const bcrypt = require("bcrypt");
const { generarJWT } = require('../validators/generar-jwt');
const aguid = require('aguid');
const guid  = aguid()

const crearCuenta = async(req = request,res = response ) => {

    const { user, email, password } = req.body


    const newUser = await new Usuario({ _id: guid, 
                                        user, 
                                        email, 
                                        password
                                        })
             
    const hashPassword = bcrypt.genSaltSync()
    newUser.password = bcrypt.hashSync( password, hashPassword);

    // validar rol
   // console.log(newUser.rol)
    await newUser.save()
    
    res.json(newUser)
 
          
    }

    const loginConfirmation = async(req = request, res = response) => {

        const { user, password } = req.body;

           try{
            const usuario = await Usuario.findOne({ user })
           

            if(!usuario){
                return res.json({
                 msg: `El usuario ${user} no se encuentra registrado`
                });
            }
        
            if( !usuario.state ){
                return res.status(400).json({
                    msg: 'Usuario no activo/disponible'
                });
            }
        
        // Verificar la contraseña
        const validarPassword = bcrypt.compareSync( password, usuario.password)
        
        if( !validarPassword ){
            return res.status(400).json({
            msg: 'La contraseña es incorrecta'
            });
        }

        // Generar JWT
        
        const token = await generarJWT ( usuario.id )
            
        return res.json({
            usuario,
            token
        })

           }catch(e){
            console.log(e)
                return res.status(500).json({
                    msg: 'Hubo un error, contacte con el admin'
                })
           }
                
            
    }
      

    const forgotPassword = (req = request, res = response ) => {
        console.log('Enviado')
    }

    
    const probarJWT = async(req = request, res = response) => {

    const { id } = req.params

    const usuario = await Usuario.findByIdAndUpdate( id, {state:false})
 
    //const usuarioAutentificado = req.usuario

        res.json({
        msg: 'Token Validado',
        usuario
        })
    }
    

module.exports = {
    crearCuenta,
    loginConfirmation,
    forgotPassword,
    probarJWT
}