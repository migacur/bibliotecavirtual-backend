const multer = require("multer")

// Middleware que detecta la imagen y aplica la configuración
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
filename: (req,file,cb) => {
    const ext = file.originalname.split('.').pop()
    cb(null, `${Date.now()}.${ext}`)
},fileFilter(req, file, cb) {
    if ( file.mimetype === 'image/jpeg' ||  file.mimetype ==='image/png' ) {
        cb(null, true);
    } else {
        cb(new Error('Formato No válido'))
    }
}
})

const uploadFile = multer({
    storage: storage,
}).single('file')

module.exports = uploadFile;