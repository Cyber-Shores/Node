const Discord = module.require("discord.js");
const config = module.require("../../config.json");
const ms = module.require('ms')
module.exports.run = async (bot, msg, args) => {

    if(!msg.member.hasPermission("MANAGE_MESSAGES")) return require('../../util/errMsg.js').run(bot, msg, false, "You do not have proper premissions.");
    let USER = msg.mentions.members.first();
    if(!USER) return require('../../util/errMsg.js').run(bot, msg, true, "Please mention a user");
    let ROLE = msg.guild.roles.cache.find(r => r.name === "Node Muted")
    
    USER.roles.remove(ROLE)
    let unmuteembed = new Discord.MessageEmbed({
        title: `**Unmute`,
        description: `${USER} has been unmuted!`,
        footer: {
            text: `${msg.author.username}`,
            icon_url: `${msg.author.displayAvatarURL()}`
        },
        timestamp: new Date(),
        color: (msg.member.displayHexColor)
    });
    msg.channel.send(unmuteembed);
}

module.exports.help = {
    name: "unmute",
    reqPerms: ['ADMINISTRATOR'],
    description: "Unmutes a specified user!",
    usage: `${config.pref}unmute [user]${config.suff}`,
    aliases: []
}