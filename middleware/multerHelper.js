const multer = require("multer")
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir)
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