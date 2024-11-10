const { default: mongoose } = require('mongoose');
const { Schema, model } = mongoose;

const RoleSchema = Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }
})



module.exports = model('Roles', RoleSchema);