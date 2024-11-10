const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: "dyylc00uq",
    api_key: "227558783833854",
    api_secret: "AGc0JpX4s3A4KNypJvNk7pOv-CU"
})

const subirImagen = async pathFile => {
    return await cloudinary.v2.uploader.upload(pathFile, {
        folder: 'biblioteca'
    })
}

module.exports = subirImagen