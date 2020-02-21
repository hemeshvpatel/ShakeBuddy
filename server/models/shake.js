const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shakeSchema = new Schema({
    name: String,
    createdBy: String
});

module.exports = mongoose.model('Shake', shakeSchema);