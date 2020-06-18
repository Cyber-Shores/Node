const Discord = module.require("discord.js");
const config = module.require("../../config.json");
module.exports.run = async (bot, msg, args) => {

    let STRINGS = args.join(' ').split('|')
    if(!msg.member.hasPermission('MANAGE_MESSAGES')) return require('../../util/errMsg.js').run(bot, msg, false, "You do not have proper perms");
    if(!STRINGS[0] || !STRINGS[1] || !STRINGS[2]) return require('../../util/errMsg.js').run(bot, msg, true, "Please fill out all perameters!");

    let rulesembed = new Discord.MessageEmbed({
        title: `${STRINGS[0]}`,
        description: `${STRINGS[1]}`,
        color: `${STRINGS[2]}`,
        timestamp: new Date(),
        footer: {
            text: `${msg.author.username}`,
            icon_url: `${msg.author.displayAvatarURL()}`,
        },
        //url: `https://github.com/Cyber-Shores/Node`, 
    },
)
    

    msg.channel.send(rulesembed)
   
}

module.exports.help = {
    name: "embed",
    reqPerms: ['MANAGE_MESSAGES'],
    description: "creates a custom embed",
    usage: `${config.pref}embed Title|Text|Hexcode${config.suff}`,
    aliases: []
}