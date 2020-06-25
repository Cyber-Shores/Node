const config = module.require('../../config.json');
const Discord = module.require('discord.js');
// eslint-disable-next-line no-unused-vars
module.exports.run = async (bot, msg) => {
	const user = msg.mentions.users.first();
	const member = msg.guild.member(user);

	if(!user) return require('../../util/errMsg.js').run(bot, msg, true, 'Please mention a user.');
	if(!msg.member.hasPermission('KICK_MEMBERS')) return require('../../util/errMsg.js').run(bot, msg, false, 'You do not have proper premissions.');
	if(user.id === msg.author.id) return require('../../util/errMsg.js').run(bot, msg, false, 'You do not have proper premissions.');
	if(member.roles.highest.position >= msg.member.roles.highest.position) return require('../../util/errMsg.js').run(bot, msg, false, `You cannot kick ${user.username} because they have higher roles than you`);

	if (member) {
		member
			.kick('test command line')
			.then(() => {
				const kickembed = new Discord.MessageEmbed()
					.setTitle('**The Boot**')
					.setDescription(`**${user.username}** Has Recieved The Boot`)
					.attachFiles('https://i.imgur.com/r42VJvZ.gif')
					.setColor(msg.member.displayHexColor);
				msg.channel.send(kickembed);
			});
	}
};

module.exports.help = {
	name: 'kick',
	category: 'Admin Tools',
	reqPerms: ['KICK_MEMBERS'],
	description: 'Kicks a user',
	usage: `${config.pref}kick [user-mention]${config.suff}`,
	aliases: [],
};