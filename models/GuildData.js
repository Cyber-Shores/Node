const { Schema, model } = require('mongoose');

const Guild = Schema({
    name: String,
    id: String,
    prefix: {
        default: '<',
        type: String
    },
    suffix: {
        default: '>',
        type: String
    },
})

module.exports = model('GuildData', Guild);