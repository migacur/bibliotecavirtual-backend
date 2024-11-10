const nodemailer = require("nodemailer");

const createTransport = () => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
         user: process.env.GMAIL_USER,
         pass: process.env.GMAIL_PASSWORD
        },
      });
    
      return transporter;
}

const sendEmailConfirm = async(userConfirm, codigo) => {
    const transporter = createTransport()
    let info = await transporter.sendMail({
        from: 'migueljes94@gmail.com',
        to: `${userConfirm.email}`, 
        subject: 'Confirma tu email - BIBLIOTECA VIRTUAL ETI',
   
        html: `
            <h1>Confirma tu correo electrónico</h1>
            <img src="https://res.cloudinary.com/dmi8mfcre/image/upload/v1683129726/vhxu1ecnftusm9snt7j6.png" 
            alt='logo-ETI'/>
            <p>Hola ${userConfirm.usuario}, este es tu código de confirmación:</p>
            <h2>${codigo}</h2>

            <small><strong>Atentamente, el ADMINISTRADOR de la web</strong></small>
        `, 
    });

    return
}

module.exports = sendEmailConfirm; 