const Discord = module.require("discord.js");
const config = module.require("../../config.json");
const ms = module.require('ms')
module.exports.run = async (bot, msg, args) => {

    if(!msg.member.hasPermission("MUTE_MEMBERS")) return require('../../util/errMsg.js').run(bot, msg, false, "You do not have proper premissions.");
    let USER = msg.mentions.members.first();
    if(!USER) return require('../../util/errMsg.js').run(bot, msg, true, "Please mention a user");
    let ROLE = msg.guild.roles.cache.find(r => r.name === "Muted")
    

    USER.roles.remove(ROLE)
    
    


}

module.exports.help = {
    name: "unmute",
    reqPerms: ['ADMINISTRATOR'],
    description: "Unmutes a specified user!",
    usage: `${config.pref}unmute [user]${config.suff}`,
    aliases: []
}