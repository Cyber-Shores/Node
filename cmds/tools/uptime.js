const config = module.require("../../config.json");
const Discord = module.require('discord.js');
module.exports.run = async (client, msg, args) => {

    const UPTIME = client.uptime

    let h,m,s;
h = Math.floor(UPTIME/1000/60/60);
m = Math.floor((UPTIME/1000/60/60 - h)*60);
s = Math.floor(((UPTIME/1000/60/60 - h)*60 - m)*60);

s < 10 ? s = `0${s}`: s = `${s}`
m < 10 ? m = `0${m}`: m = `${m}`
h < 10 ? h = `0${h}`: h = `${h}`

    let embed = new Discord.MessageEmbed({
        title: "**Uptime**",
        description: `I have been online for ${h}:${m}:${s}`,
        color: msg.member.displayHexColor,
        footer: {
            "text": msg.author.username,
            "icon_url": msg.author.displayAvatarURL()
        },
        timestamp: Date.now()
    });
    msg.channel.send(embed);

    console.log(`Up Time command Logged! ${msg.author.tag}`)

}
    

module.exports.help = {
    name: "uptime",
    reqPerms: [''],
    description: "Shows the uptime of the bot",
    usage: `${config.pref}uptime${config.suff}`,
    aliases: ['']
}