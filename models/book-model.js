const { default: mongoose } = require('mongoose');
const { Schema, model } = mongoose;

const bookSchema = new Schema({

    titulo: {
        type: String,
        required: [true, 'El título del libro es obligatorio']
    },
    imagen: {
        type: String,
       // required: [true, 'La imagen del libro es obligatoria']
       required: [true, 'La imagen del libro es obligatorio']
    },
    enlace: {
        type: String,
        required: [true, 'El enlace del libro es obligatoria']
    },
    categoria: {
        type: String,
        required: [true, 'La categoría del libro es obligatoria']
    },
    estado: {
        type: Boolean,
        default: false
    },
    favoriteOf: [{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }]

}, {versionKey: false});

module.exports = model( 'Books', bookSchema)