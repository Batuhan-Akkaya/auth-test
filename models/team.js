const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    logo: String,
    colors: Array,
    fonts: Array,
    billings: Array
});

mongoose.model('Team', TeamSchema);
