const { Schema, model } = require('mongoose');
const Bio = Schema({
    id: String,
    bio: {
        default: 'None',
        type: String
    },
});
module.exports = model('UserBio', Bio);
