const jwt = require('jsonwebtoken');

const authCookieJWT = (req, res, next) => {
  const token = req.cookies.token_de_acceso

  if (!token) {
    return res.status(401).json({msg:'Acceso NO autorizado'});
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({msg:'Prohibido el acceso'});
    }
    req.payload = user;
    next();
  });
};

module.exports = authCookieJWT;
