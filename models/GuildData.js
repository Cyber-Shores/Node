const { Schema, model } = require('mongoose');

const Guild = Schema({
    id: String,
    prefix: {
        default: '<',
        type: String
    },
    suffix: {
        default: '>',
        type: String
    },
    serverbio: {
        default: `None`,
        type: String
    }
})

module.exports = model('GuildData', Guild);