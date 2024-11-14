const { response, request } = require("express");
const Users = require("../models/users-bv");
const bcrypt = require("bcrypt");
const Books = require("../models/book-model");
const generarToken = require("../helpers/generarToken");
const generarCodigo = require("../helpers/generarCode");
const sendEmailCode = require("../libs/emailCode");
const sendEmailConfirm = require("../libs/emailConfirm");

const mostrarUsuarios = async(req= request, res=response) => {

    try {
        
    const usuarios = await Users.find({}).populate('favoritos')

    if(!usuarios){
        return res.status(400).json({
            msg: 'No se encontraron usuarios'
        })
    }

    return res.json(usuarios)
    } catch (error) {
        return res.status(400).json({
            msg: 'Ha ocurrido un error al mostrar los usuarios'
        })
    }

}


const mostrarUser = async(req= request, res=response) => {

    try {

        if(!req.payload.id){
            return res.status(401).json({msg:"Acceso Denegado"})
        }

        const user = await Users.findById({_id: req.payload.id})
    
        if(!user){
            return res.status(400).json({
                msg: 'Este usuario no existe o no está habilitado'
            })
        }


        return res.json({
            user
        })

    } catch (error) {
        return res.status(401).json({
            msg: 'Error al acceder al perfil del usuario'
        })
    }

    
   
}

const crearCuentaBV = async(req = request,res = response ) => {

  const { usuario, email, password, repeat } = req.body

   try {

    if(!usuario || !email || !password || !repeat){
        return res.status(400).json({
            msg: 'Todos los campos son obligatorios'
        })
    }

    if(password !== repeat){
        return res.status(400).json({
            msg: 'Las contraseñas no coinciden'
        })
    }

    const user = await new Users({usuario, email, password})

    const hashPassword = bcrypt.genSaltSync(10)
    user.password = bcrypt.hashSync( password, hashPassword);


    await user.save()

    return res.json({
        user
    })
  
   } catch (error) {
 
     return res.status(500).json({
        msg: 'Hubo un error, contacte con el administrador de la web'
    })
   }
   
   
    }

    
    const confirmarLogin = async(req = request, res = response) => {

        const { usuario, password } = req.body;

           try{

            if(!usuario || !password){
                return res.status(404).json({
                    msg: 'Usuario y Password son campos obligatorios'
                   });
            }

            const nuevoUsuario = await Users.findOne({usuario})

            if(!nuevoUsuario){
                return res.status(404).json({
                 msg: `El usuario ${usuario} no se encuentra registrado`
                });
            }
         
    
        // Verificar la contraseña
        const validarPassword = bcrypt
            .compareSync( password, nuevoUsuario.password)
        
        if( !validarPassword ){
            return res.status(400).json({
            msg: 'La contraseña es incorrecta'
            });
        }

        const token = await generarToken(nuevoUsuario)

        const userInfo = {
            _id: nuevoUsuario._id,
            avatar: nuevoUsuario.avatar,
            favoritos: nuevoUsuario.favoritos
        }

        return res.json({
            userInfo,
            token
        })
           
           }catch(e){
            console.log(e)
              return res.status(500).json({
                    msg: 'Hubo un error, contacte con el administrador de la web'
                })
           }
                
            
    }




    const agregarUsuarioFavoritos = async(req=request, res=response) => {
           
            try {
                const userID = req.params.id
                const bookID = req.body

                const user = await Users.findById(userID)
                const book = await Books.findById(bookID)
        
                if(userID !== req.payload.id){
                    return res.status(400).json({
                        msg: 'Se ha producido un error al realizar esta acción.'
                    })
                }

                if(user.favoritos.includes(bookID) || book.favoriteOf.includes(userID)){
                    return res.status(400).json({
                        msg: 'Este libro ya se encuentra en tus favoritos.'
                    })
                }

                if(user.favoritos.length === 20){
                    return res.status(400).json({
                        msg: 'NO puedes agregar más de 20 libros a favoritos.'
                    })
                }

                user.favoritos.push(bookID)
                await user.save()
                book.favoriteOf.push(userID)
                await book.save()
                
                return res.status(200).json({
                    msg: 'El libro se agregó a favoritos',
                })

            } catch (error) {
                console.log(error)
                res.status(500).json({
                    msg: 'Error, contacte con el administrador...'
                })
            }
       

    }
    
    const mostrarFavoritos = async(req=request, res=response) => {

        const { id } = req.params;

        const user = await Users.findById({_id: id}).populate('favoritos', {
            titulo: 1,
            imagen: 1,
            enlace: 1,
            categoria: 1
        })

        if(id !== req.payload.id){
            return res.status(400).json({
                msg: 'Se ha producido un error al realizar esta acción.'
            })
        }

        if(!user){
            return res.status(400).json({
                msg: 'Error al mostrar los datos'
            })

        }
        res.json(user.favoritos)
       
    }


    const borrarFavorito = async(req=request, res=response) => {
        try {
            const userID = req.params.id
            const bookID = req.body

            const user = await Users
                  .findOneAndUpdate({_id: userID}, { $pull: { favoritos: bookID._id } })
                  await user.save()
            const book = await Books
                  .findOneAndUpdate({_id: bookID}, { $pull: { favoriteOf: userID } })
                  await book.save()
           
            if(!user || !book){
                return res.status(400).json({
                    msg: 'Ocurrió un error al eliminar el libro'
                })
            }

            return res.status(200).json({
                msg: 'El libro se eliminó correctamente'
            })
     
        } catch (error) {
            console.log(error)
            res.status(500).json({
                msg: 'Error, contacte con el administrador...'
            })
        }
   
    }

    const enviarCorreo = async(req=request, res=response) => {
        
        const user = await Users.findOne({email: req.body.email})
        
        if(!user){
            return res.status(400).json({
                msg: 'No hay usuario registrado con ese correo electrónico'
            })
        }

        const code = generarCodigo(6)
        
        
        //actualizar usuario
        user.userCode = code;
        await user.save()
        await sendEmailCode(user, code)

        return res.status(200).json({
            msg: 'Código de recuperación enviado a su correo'
        })

    }

    const enviarCodigo =  async(req=request, res=response) => {
           const correo = req.body.email;
           const code = req.body.code;
           
           const user = await Users.findOne({email: correo});
        
           if(!user){
            return res.status(400).json({
                msg: 'No hay usuario registrado con ese correo electrónico'
            })
           }

           if(code !== user.userCode){
            return res.status(400).json({
                msg: 'El código de verificación es inválido'
            })
           }

           if(req.body.password !== req.body.repeatPassword){
            return res.status(400).json({
                msg: 'Las contraseñas no coinciden'
            })
           }

           const hashPassword = bcrypt.genSaltSync(10)
           user.password = bcrypt.hashSync( req.body.password, hashPassword);
           await user.save()
           user.userCode = null;
           await user.save()
           
           return res.status(200).json({
            msg: 'Contraseña modificada con exito'
           })
    }
    
    const confirmarCorreo = async(req=request, res=response) => {
            
      const searchUser = await Users.findById(req.params.id)

      if(!searchUser){
        return res.status(400).json({
            msg: 'No se encontró usuario registrado con ese correo electrónico'
        })
      }
      
      const code = generarCodigo(6)
      await sendEmailConfirm(searchUser, code)

      searchUser.userCode = code
      await searchUser.save()
    
      return res.status(200).json({
        msg: 'Se ha enviado el código para confirmar su correo'
      })
    }

    const codeConfirmEmail = async(req=request, res=response) => {
            
        const user = await Users.findOne({email: req.body.email});

        if(!user){
            return res.status(400).json({
                msg: 'No hay usuario registrado con ese correo electrónico'
            })
           }
        
        if(req.body.code !== user.userCode){
            return res.status(400).json({
                msg: 'El código de verificación es inválido'
            })
        }

        user.userCode = null;
        await user.save()
        user.state = true;
        await user.save()

        return res.status(200).json({
            msg: 'Tu correo ha sido confirmado con éxito'
        })

    }

    module.exports = {
        mostrarUsuarios,
        mostrarUser,
        crearCuentaBV,
        confirmarLogin,
        agregarUsuarioFavoritos,
        mostrarFavoritos,
        borrarFavorito,
        enviarCorreo,
        enviarCodigo,
        confirmarCorreo,
        codeConfirmEmail
    }