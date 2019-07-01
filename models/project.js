const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: String,
    type: String,
    screenshot: String,
    assets: Array,
    history: Array
});

module.exports = mongoose.model('Project', ProjectSchema);
