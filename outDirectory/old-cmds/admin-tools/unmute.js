const Discord = module.require('discord.js');
const config = module.require('../../config.json');
module.exports.run = async (bot, msg) => {
    if (!msg.member.hasPermission('MANAGE_MESSAGES'))
        return require('../../util/errMsg.js').run(bot, msg, false, 'You do not have proper premissions.');
    const user = msg.mentions.members.first();
    if (!user)
        return require('../../util/errMsg.js').run(bot, msg, true, 'Please mention a user');
    const role = msg.guild.roles.cache.find(r => r.name === 'Node Muted');
    user.roles.remove(role);
    const unmuteembed = new Discord.MessageEmbed({
        title: 'Unmute',
        description: `${user} has been unmuted!`,
        footer: {
            text: `${msg.author.username}`,
            icon_url: `${msg.author.displayAvatarURL()}`,
        },
        timestamp: new Date(),
        color: (msg.member.displayHexColor),
    });
    msg.channel.send(unmuteembed);
};
module.exports.help = {
    name: 'unmute',
    category: 'Admin Tools',
    reqPerms: ['MANAGE_MESSAGES'],
    description: 'Unmutes a specified user!',
    usage: `${config.pref}unmute [user]${config.suff}`,
    aliases: [],
};
