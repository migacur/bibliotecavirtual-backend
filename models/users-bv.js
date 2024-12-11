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
        default: "",
        validate: {
            validator: function(v) {
                return /^https:\/\//.test(v);
            },
            message: props => `${props.value} no es una URL segura (debe ser https://)!`
        }
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
    favoritos: [{
       type: Schema.Types.ObjectId,
       ref: 'Books'
    }],
    userCode: {
        type: String,
        default: null
    }

}, { versionKey: false });

userBVSchema.pre('save', function(next) { 
    if (this.avatar && this.avatar.startsWith('http://')) {
        this.avatar = this.avatar.replace(/^http:\/\//, 'https://');
    }
    next();
});

// Excluir ciertas propiedades al convertir a JSON
userBVSchema.methods.toJSON = function() {
    const { password, state, ...user } = this.toObject();
    return user;
};

module.exports = model('Users', userBVSchema);
