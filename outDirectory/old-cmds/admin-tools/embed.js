const Discord = module.require('discord.js');
const config = module.require('../../config.json');
module.exports.run = async (bot, msg, args) => {
    const strings = args.join(' ').split('|');
    if (!msg.member.hasPermission('MANAGE_MESSAGES'))
        return require('../../util/errMsg.js').run(bot, msg, false, 'You do not have proper perms');
    if (!strings[0] || !strings[1] || !strings[2])
        return require('../../util/errMsg.js').run(bot, msg, true, 'Please fill out all parameters!');
    const rulesembed = new Discord.MessageEmbed({
        title: `${strings[0]}`,
        description: `${strings[1]}`,
        color: `${strings[2]}`,
        timestamp: new Date(),
        footer: {
            text: `${msg.author.username}`,
            icon_url: `${msg.author.displayAvatarURL()}`,
        },
    });
    msg.channel.send(rulesembed);
};
module.exports.help = {
    name: 'embed',
    category: 'Admin Tools',
    reqPerms: ['MANAGE_MESSAGES'],
    description: 'creates a custom embed',
    usage: `${config.pref}embed Title|Text|Hexcode${config.suff}`,
    aliases: [],
};
