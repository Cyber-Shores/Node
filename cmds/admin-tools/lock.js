const config = module.require('../../config.json');
const Discord = module.require('discord.js');
module.exports.run = async (bot, msg, args) => {

	const channelmention = msg.mentions.channels.first();

	// simple check for permissions and mention
	if(!msg.member.hasPermission('MANAGE_MESSAGES')) return require('../../util/errMsg.js').run(bot, msg, false, 'You do not have proper premissions.');
	if(!channelmention) return require('../../util/errMsg.js').run(bot, msg, true, 'Please mention a channel');
	// the actual overwrite itself
	channelmention.overwritePermissions([
		{
			id: msg.guild.roles.everyone.id,
			deny: ['SEND_MESSAGES'],
		},
	]);
	// the rest of the command output if the overwrite gets run

	const STRINGS = args.join(' ').split(' <');

	const embed = new Discord.MessageEmbed({
		title: `#${channelmention.name}`,
		description: `Has been locked because:\n ${STRINGS[0]}`,
		timestamp: new Date(),
		footer: {
			text: `${msg.author.username}`,
			icon_url: `${msg.author.displayAvatarURL()}`,
		},
		color: (msg.member.displayHexColor),
	});
	channelmention.send(embed);

};


module.exports.help = {
	name: 'lock',
	category: 'Admin Tools',
	reqPerms: ['MANAGE_MESSAGES'],
	description: 'Locks a channel',
	usage: `${config.pref}lock [reason] [channel-mention]${config.suff}`,
	aliases: [],
};