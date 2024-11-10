// importaciones
const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express()
require("dotenv").config();
const Cors = require('cors');
const bookRouter = require('./routes/books');
const usuarioRouter = require('./routes/usuarios-bv');
const multer = require('multer');
const sharp = require('sharp');
const uploadFile = require('./middleware/multerHelper')
const path = require('path');
// settings
const PORT = process.env.PORT || 3000;
//const staticRoute = path.join(__dirname, './uploads')
//app.use('/apirest', express.static(staticRoute))
const cloudinary = require('cloudinary').v2
const fs = require('fs-extra');
const Users = require('./models/users-bv');
const cookieParser = require('cookie-parser');

app.use(cookieParser())
app.use(Cors())

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
})
//Optimizar imagenes

const helperImage = (filePath, fileName, size = 300) => {
    return sharp(filePath)
           .resize(size)
           .toFile(`./optimize/${fileName}.png`)
}

//ruta para subir imagen
app.post('/upload-image', uploadFile, async(req,res) => {
   
    //helperImage(req.file.path,`resize-${req.file.filename}`,180)
    
    const result = await cloudinary.uploader.upload(req.file.path)
    console.log(result)

    await fs.unlink(req.file.path)

    res.send('Imagen cargado')
})

app.post('/change-avatar/:id', uploadFile, async(req,res) => {
   
    //helperImage(req.file.path,`resize-${req.file.filename}`,180)
    console.log(req.file)
    const result = await cloudinary.uploader.upload(req.file.path)
   
    const usuario = await Users.findById({_id: req.params.id})

    if(!usuario){
        return res.status(400).json({
            msg: "Ha ocurrido un error"
        })
    }

    usuario.avatar = result.url

    await usuario.save()

    await fs.unlink(req.file.path)

    res.send(result.url)
})


// habilitar lectura de datos de formularios
app.use(express.urlencoded({extended: true}))


// middlewares
app.use(express.json())


app.use(bookRouter)

app.use(usuarioRouter)

app.get('/contacto', (req, res) => {
    res.render('contacto')
})


app.get('*', (req,res) => {
    res.status(404).send('Página no encontrada')
})


const connectDB = async() => {
    await mongoose.connect(process.env.MONGODB_URL)

    app.listen(PORT, () => {
        console.log(`Servidor montado en el puerto: ${PORT}`)
    })

}


connectDB()

