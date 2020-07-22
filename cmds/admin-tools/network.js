const { MessageEmbed } = require('discord.js');

const config = module.require('../../config.json');
module.exports.run = async (bot, msg, args) => {
	if(!msg.member.hasPermission('MANAGE_CHANNELS')) return require('../../util/errMsg.js').run(bot, msg, false, 'You do not have proper perms');
	function getDate() {
		const today = new Date();
		const dd = String(today.getDate()).padStart(2, '0');
		const mm = String(today.getMonth() + 1).padStart(2, '0');
		const yyyy = today.getFullYear();

		return `${mm}/${dd}/${yyyy}`;
	}
	if(!args[0]) {
		let channel;
		try {
			channel = await msg.guild.channels.create('node-network', {
				type: 'text',
				topic: 'Welcome to the Node Network v1.1! Say Hi, and be friendly.',
				nsfw: true,
				reason: 'For connection to the Node Network',

			});
			channel.send(new MessageEmbed({
				title: `Welcome to the Node Network, ${msg.guild.name}.`,
				description: 'The Node Network connects a "network" of servers together through one channel.\nBe friendly to others or risk having your server blacklisted.\nTo start, just say Hi! (Bots do not work in Node Networks btw)',
				color: 0x07592b,
				fields: [
					{
						name: `Number of servers connected to the Node Network as of ${getDate()}:`,
						value: `\`\`\`js\n${bot.guilds.cache.filter(g => g.channels.cache.find(c => c.name == 'node-network')).size}\`\`\``,
					},
				],
			})).then(m => m.pin());
			msg.channel.send(new MessageEmbed({
				title: `${msg.guild.name} successfully connected to the Node Network!`,
				description: `<#${channel.id}>`,
				color: msg.member.displayHexColor,
				timestamp: new Date(),
				footer: {
					text: `${msg.author.username}`,
					icon_url: `${msg.author.displayAvatarURL()}`,
				},
			}));
		}
		catch(e) {
			console.log(e.stack);
			return require('../../util/errMsg.js').run(bot, msg, false, 'Uh Oh, failed to properly generate a Node Network channel!\nIf a channel was created, delete it then please report this in our support server: https://discord.gg/GUvk7Qu');
		}
	} else {
		if(!args[1]) return require('../../util/errMsg.js').run(bot, msg, true, `Must initialize the custom network with a name and 5 digit numeric password\ne.g. ${config.pref}network Test 00000${config.suff}`);
		if(args[0].length > 95) return require('../../util/errMsg.js').run(bot, msg, true, "Name must be 95 characters or less");
		if(args[1].length != 5) return require('../../util/errMsg.js').run(bot, msg, true, "Password must contain exactly 5 digits");
		for(let i = 0; i < args[1].length; i++) {
			if(isNaN(parseInt(args[1].substring(i,i+1)))) return require('../../util/errMsg.js').run(bot, msg, true, "Password may only contain numbers");
		}
		let channel;
		try {
			channel = await msg.guild.channels.create(`node-${args[0]}`, {
				type: 'text',
				topic: `${args[0]} ${args[1]}`,
				nsfw: true,
				reason: 'For connection to the Node Network',

			});
			channel.send(new MessageEmbed({
				title: `Welcome to the ${args[0]} custom Node Network, ${msg.guild.name}.`,
				color: msg.member.displayHexColor,
				fields: [
					{
						name: `Number of servers connected to this custom Node Network as of ${getDate()}:`,
						value: `\`\`\`js\n${bot.guilds.cache.filter(g => g.channels.cache.find(c => c.name == `node-${args[0]}`)).size}\`\`\``,
					},
				],
			})).then(m => m.pin());
			msg.channel.send(new MessageEmbed({
				title: `${msg.guild.name} successfully connected to the ${args[0]} Network!`,
				description: `<#${channel.id}>`,
				color: msg.member.displayHexColor,
				timestamp: new Date(),
				footer: {
					text: `${msg.author.username}`,
					icon_url: `${msg.author.displayAvatarURL()}`,
				},
			}));
		}
		catch(e) {
			console.log(e.stack);
			return require('../../util/errMsg.js').run(bot, msg, false, 'Uh Oh, failed to properly generate a Node Network channel!\nIf a channel was created, delete it then please report this in our support server: https://discord.gg/GUvk7Qu');
		}

	}

};

module.exports.help = {
	name: 'network',
	category: 'Admin Tools',
	reqPerms: ['MANAGE_CHANNELS'],
	description: 'Creates a NodeNetwork channel where you can talk to fellow Node using servers across Discord!',
	usage: `${config.pref}network${config.suff}`,
	aliases: ['nodeNetwork', 'startNetwork', 'startNet', 'net', 'nodeNet'],
};