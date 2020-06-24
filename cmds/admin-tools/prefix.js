const { MessageEmbed } = module.require('discord.js');
const config = module.require('../../config.json');
const GuildModel = require('../../models/GuildData');
module.exports.run = async (bot, msg, args) => {
	if (!args[0]) {
		const req = await GuildModel.findOne({ id: msg.guild.id });
		if (!req) return require('../../util/errMsg').run(bot, msg, true, 'Something went wrong while loading your servers prefix/suffix\nPlease report this to our support server: https://discord.gg/GUvk7Qu');
		const prefixembed = new MessageEmbed({
			title: 'Server Prefix & Suffiix:',
			description: `Prefix:  ${req.prefix}\nSuffix:  ${req.suffix}\n`,
			color: msg.member.displayHexColor,
			footer: {
				'text': msg.author.username,
				'icon_url': msg.author.displayAvatarURL(),
			},
			timestamp: Date.now(),
		});

		return msg.channel.send(prefixembed);

	}
	else if(args[0] == 'set') {
		if(!msg.member.hasPermission('ADMINISTRATOR')) return require('../../util/errMsg').run(bot, msg, false, 'You do not have proper premissions.');
		if(!args[1] || !args[2]) return require('../../util/errMsg').run(bot, msg, true, 'Please provide both a prefix and a suffix!');
		if(args[1].length > 2 || args[2].length > 2) return require('../../util/errMsg').run(bot, msg, true, 'Neither the prefix nor the suffix can be over 2 characters long!');
		// setting a new prefix using the default one
		const req = await GuildModel.findOne({ id: msg.guild.id });
		if(!req) return require('../../util/errMsg').run(bot, msg, true, 'Something went wrong while loading your servers prefix/suffix\nPlease report this to our support server: https://discord.gg/GUvk7Qu');
		await GuildModel.findOneAndUpdate({ id: msg.guild.id }, { $set: { suffix: `${args[2]}` } }, { new: true });
		await GuildModel.findOneAndUpdate({ id: msg.guild.id }, { $set: { prefix: `${args[1]}` } }, { new: true });
		const setprefixembed = await new MessageEmbed({
			title: 'New Prefix and Suffix',
			description: `Prefix: ${args[1]}\nSuffix: ${args[2]}\n`,
			color: msg.member.displayHexColor,
			footer: {
				'text': msg.author.username,
				'icon_url': msg.author.displayAvatarURL(),
			},
			timestamp: Date.now(),
		});
		return await msg.channel.send(setprefixembed);
		// end
	}
};

module.exports.help = {
	name: 'prefix',
	category: 'Tools',
	reqPerms: [],
	description: 'View or set the custom prefix/suffix for this server',
	usage: `${config.pref}prefix${config.suff} || ${config.pref}prefix set [prefix] [suffix]${config.suff}`,
	aliases: ['suffix'],
};