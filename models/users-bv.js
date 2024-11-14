const { default: mongoose } = require('mongoose');
const { Schema, model } = mongoose;

const userBVSchema = new Schema({

    usuario: {
        type: String, 
        required: [true, 'El usuario es obligatorio'],
        unique: true,
        lowercase: true
    },
    avatar: { 
        type: String,
        default: ""
    },
    email: {
        type: String, 
        required: [true, 'El correo es obligatorio'],
        unique: true,
        lowercase: true,
        trim : true
    },
    password: {
        type: String, 
        required: [true, 'El password es obligatorio']
    },
    rol: {
        type: String,
        default: 'USER_ROLE'
    },
    state: {
        type: Boolean,
        default: false
    },
    favoritos:[{
       type: Schema.Types.ObjectId,
       ref: 'Books'
    }],
     userCode: {
        type: String,
        default: null
     }

}, {versionKey: false});

userBVSchema.methods.toJSON = function() {
    const { password, ...user  } = this.toObject();
    return user;
}



module.exports = model( 'Users', userBVSchema)