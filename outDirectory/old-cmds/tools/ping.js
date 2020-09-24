const config = module.require('../../config.json');
const Discord = module.require('discord.js');
module.exports.run = async (bot, msg) => {
    const pingingembed = new Discord.MessageEmbed({
        title: 'Pinging...',
    });
    msg.channel.send(pingingembed).then(m => {
        const ping = m.createdTimestamp - msg.createdTimestamp;
        const pingembed = new Discord.MessageEmbed({
            title: 'Pong',
            description: `${ping}ms`,
            color: msg.member.displayHexColor,
            footer: {
                'text': msg.author.username,
                'icon_url': msg.author.displayAvatarURL(),
            },
            timestamp: Date.now(),
        });
        msg.channel.send(pingembed);
        m.delete();
    });
};
module.exports.help = {
    name: 'ping',
    category: 'Tools',
    reqPerms: [],
    description: 'Gets Bot Ping',
    usage: `${config.pref}ping${config.suff}`,
    aliases: [],
};
