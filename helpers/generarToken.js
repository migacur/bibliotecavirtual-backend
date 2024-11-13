const jwt = require('jsonwebtoken');

const generarToken = (user) => {
    const secretKey = process.env.SECRET_KEY;

    const payload = {
        id: user._id
    };

    const token = jwt.sign(payload, secretKey, {
        expiresIn: '8h'
    });

    return token;
}

module.exports = generarToken;