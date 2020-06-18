const config = module.require("../../config.json");
const Discord = module.require('discord.js');
module.exports.run = async (client, msg, args) => {
    let pingingembed = new Discord.MessageEmbed({
        title: `Pinging...`
    })
    
    msg.channel.send(pingingembed).then(m => {
        let ping = m.createdTimestamp - msg.createdTimestamp

        let pingembed = new Discord.MessageEmbed({
            title: `Pong`,
            description: `${ping}ms`,
            color: msg.member.displayHexColor,
        footer: {
            "text": msg.author.username,
            "icon_url": msg.author.displayAvatarURL()
        },
        timestamp: Date.now()
        })

        msg.channel.send(pingembed)

        m.delete()
    })

}

module.exports.help = {
    name: "ping",
    reqPerms: [],
    description: "Gets Bot Ping",
    usage: `${config.pref}ping${config.suff}`,
    aliases: ['']
}