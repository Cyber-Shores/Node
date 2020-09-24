const config = module.require('../../config.json');
const Discord = module.require('discord.js');
module.exports.run = async (bot, msg) => {
    const user = msg.mentions.users.first();
    const member = msg.guild.member(user);
    // checking if command is valid to run by user
    if (!user)
        return require('../../util/errMsg.js').run(bot, msg, true, 'Please mention a user');
    if (!msg.member.hasPermission('BAN_MEMBERS'))
        return require('../../util/errMsg.js').run(bot, msg, false, 'You do not have proper premissions.');
    if (user.id === msg.author.id)
        return require('../../util/errMsg.js').run(bot, msg, false, 'You cannot ban yourself.');
    if (member.roles.highest.position >= msg.member.roles.highest.position)
        return require('../../util/errMsg.js').run(bot, msg, false, `You cannot kick ${user.username} because they have higher roles than you.`);
    // end
    // the banning of the member
    if (member) {
        member
            .ban('test command line')
            .then(() => {
            const banembed = new Discord.MessageEmbed()
                .setTitle('**Ban Hammer**')
                .setDescription(`The Ban Hammer Has Struck Down ${user.username}`)
                .attachFiles('https://i.imgur.com/r42VJvZ.gif')
                .setColor(msg.member.displayHexColor);
            msg.channel.send(banembed);
        });
        // end
    }
};
module.exports.help = {
    name: 'ban',
    category: 'Admin Tools',
    reqPerms: ['BAN_MEMBERS'],
    description: 'Bans a user',
    usage: `${config.pref}ban [user-mention]${config.suff}`,
    aliases: [],
};
