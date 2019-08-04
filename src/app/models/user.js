// importa o mongoose
const mongoose = require('../../database');

// importando o bcrypts - criptografia
const bcrypt = require('bcryptjs')

// definindo o schema do banco de dados
const userSchema = new mongoose.Schema({
    name:
     {
        type: String,
        required: true
    },
    email: 
    {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password:
     {
        type: String,
        required: true,
        select: false
    },
    passwordResetToken:{
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false

    },
    createdAt:
     {
        type: Date,
        default: Date.now
    },
});

// antes de salvar o usuario
userSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
})

// define o model
const User = mongoose.model('User', userSchema);

// exporta o model usuario
module.exports = User;
