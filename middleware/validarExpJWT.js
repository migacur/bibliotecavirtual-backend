const { expressjwt } = require("express-jwt");

const secret = process.env.SECRET_KEY

const authVerifyToken = expressjwt({
    secret,
    algorithms: ["HS256"],
    requestProperty: 'payload',
    function(req){
        const token = req.cookies.token
        console.log(token)
        if (req.headers.authorization &&
            req.headers.authorization.split(" ")[0] === "Bearer"){
            const token = req.headers.authorization.split("")[1]
            console.log(token)
            return token;
     
        }
            return null;
    }
})
 
module.exports = authVerifyToken