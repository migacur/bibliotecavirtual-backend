 
       const validarCookie = async(req,res, next) => {
     
        const token = req.cookies.token
 
        if(!token){
         return res.status(401).json({
             msg: "No estás autorizado"
         })
        }
 
         next()
        
       
 }

 module.exports = validarCookie;