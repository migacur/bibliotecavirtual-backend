const { default: mongoose } = require('mongoose');
const { Schema, model } = mongoose;

const userBVSchema = new Schema({

    usuario: {
        type: String, 
        required: [true, 'El usuario es obligatorio'],
        unique: true,
        lowercase: true,
        index: true 
    },
    avatar: { 
        type: String,
        default: "",
        validate: {
            validator: function(v) {
                // Permitir http y https en la URL del avatar
                return v === "" || /^https?:\/\//.test(v);
            },
            message: props => `${props.value} no es una URL válida (debe comenzar con http:// o https://)!`
        }
    },
    email: {
        type: String, 
        required: [true, 'El correo es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true
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
    favoritos: [{
        type: Schema.Types.ObjectId,
        ref: 'Books'
    }],
    userCode: {
        type: String,
        default: null
    }

}, { versionKey: false });

// Middleware para actualizar la URL del avatar antes de la validación
userBVSchema.pre('save', function(next) {
    if (this.avatar && this.avatar.startsWith('http://')) {
        this.avatar = this.avatar.replace(/^http:\/\//, 'https://');
    }
    next();
});

// Método para obtener la URL segura del avatar
userBVSchema.methods.getSecureAvatarUrl = function() {
    if (this.avatar && this.avatar.startsWith('http://')) {
        return this.avatar.replace(/^http:\/\//, 'https://');
    }
    return this.avatar;
};

// Excluir ciertas propiedades al convertir a JSON
userBVSchema.methods.toJSON = function() {
    const { password, state, ...user } = this.toObject();
    user.avatar = this.getSecureAvatarUrl(); // Asegurar que la URL del avatar sea https en la salida JSON
    return user;
};

module.exports = model('Users', userBVSchema);
