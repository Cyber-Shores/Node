const { MessageEmbed } = module.require('discord.js');
const config = module.require('../../config.json');
module.exports.run = async (bot, msg) => {
	try {
		const link = await bot.generateInvite(['ADMINISTRATOR']);
		const embed = new MessageEmbed({
			color: msg.member.displayHexColor,
			author: {
				name: 'Join The Support Server!',
				url: 'https://discord.gg/GUvk7Qu',
			},
			image: {
				url: bot.user.displayAvatarURL(),
			},
			title: 'Add the bot!',
			url: link,
			timestamp: new Date(),
			footer: {
				text: `${msg.author.username}`,
				icon_url: `${msg.author.displayAvatarURL()}`,
			},
		});
		msg.channel.send(embed);
	}
	catch(e) {
		console.log(e.stack);
	}
};

module.exports.help = {
	name: 'invite',
	category: 'Tools',
	reqPerms: [],
	description: 'Sends an invite link',
	usage: `${config.pref}invite${config.suff}`,
	aliases: ['link'],
};