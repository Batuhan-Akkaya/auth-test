const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UsersSchema = new mongoose.Schema({
    email: String,
    role: String,
    password: String,
    firstName: String,
    lastName: String,
    company: String,
    termsOfConditions: [String],
    projects: [{type: mongoose.Schema.Types.ObjectId, ref: 'Projects'}]
});

UsersSchema.methods.setPassword = function(password) {
    this.password = bcrypt.hashSync(password, 8);
};

UsersSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

UsersSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        role: this.role,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
};

UsersSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        email: this.email,
        role: this.role,
        token: this.generateJWT(),
    };
};

module.exports = mongoose.model('Users', UsersSchema);
