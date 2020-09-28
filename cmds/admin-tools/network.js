const { MessageEmbed } = require('discord.js');

const config = module.require('../../config.json');
module.exports.run = async (bot, msg) => {
	function getDate() {
		const today = new Date();
		const dd = String(today.getDate()).padStart(2, '0');
		const mm = String(today.getMonth() + 1).padStart(2, '0');
		const yyyy = today.getFullYear();

		return `${mm}/${dd}/${yyyy}`;
	}
	if(!msg.member.hasPermission('ADMINISTRATOR')) return require('../../util/errMsg.js').run(bot, msg, false, 'You do not have proper perms');
	let channel = msg.guild.channels.cache.find(c => c.name == 'node-network');
	if(!channel) {
		try {
			channel = await msg.guild.channels.create('node-network', {
				type: 'text',
				topic: 'Welcome to the Node Network v1.0! Say Hi, and be friendly.',
				reason: 'For connection to the Node Network',

			});
			channel.send(new MessageEmbed({
				title: `Welcome to the Node Network, ${msg.guild.name}.`,
				description: 'The Node Network connects a "network" of servers together through one channel.\nBe friendly to others or risk having your server blacklisted.\nTo start, just say Hi! (Bots do not work in Node Networks btw)',
				color: 0x07592b,
				fields: [
					{
						name: `Number of servers in connected to the Node Network as of ${getDate()}:`,
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
	}
	else{
		return require('../../util/errMsg.js').run(bot, msg, false, `A Node Network channel already exists in this server: <#${channel.id}>\nIf you wish to recreate the Node Network channel, you must first delete or rename that channel.`);
	}


};

module.exports.help = {
	name: 'network',
	category: 'Admin Tools',
	reqPerms: ['ADMINISTRATOR'],
	description: 'Creates a NodeNetwork channel where you can talk to fellow Node using servers across Discord!',
	usage: `${config.pref}network${config.suff}`,
	aliases: ['nodeNetwork', 'startNetwork', 'startNet', 'net', 'nodeNet'],
};