const config = module.require("../../config.json");
const Discord = module.require('discord.js')
module.exports.run = async (client, msg, args) => {

    msg.delete()

    let channelmention =  msg.mentions.channels.first()

    //simple check for permissions and mention
    if(!msg.member.hasPermission("MANAGE_MESSAGES")) return require('../../util/errMsg.js').run(bot, msg, false, "You do not have proper premissions.");
    if(!channelmention) return require('../../util/errMsg.js').run(bot, msg, false, "You do not have proper premissions.");
    //the actual overwrite itself
    channelmention.overwritePermissions([
        {
            id: msg.guild.roles.everyone.id,
            allow: ['SEND_MESSAGES']
        }
    ]);
    //the rest of the command output if the overwrite gets run
    
    let embed = new Discord.MessageEmbed({
        title: `#${channelmention.name}`,
        description: `Has been unlocked.`,
        timestamp: new Date(),
        footer: {
            text: `${msg.author.username}`,
            icon_url: `${msg.author.displayAvatarURL()}`
        },
        color: (msg.member.displayHexColor)
    })
    channelmention.send(embed)

    console.log(`${channelmention.name} Was unlocked by ${msg.author.tag}`)

}



module.exports.help = {
    name: "unlock",
    reqPerms: [],
    description: "Unlock a channel",
    usage: `${config.pref}unlock [channel-mention]${config.suff}`,
    aliases: []
}