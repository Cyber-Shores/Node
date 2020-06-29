const { MessageEmbed } = module.require('discord.js');
const config = module.require('../../config.json');
const { Menu } = module.require('discord.js-menu');
const axios = require("axios")

module.exports.run = async (bot, msg, args) => {
	function calcDate(date1, date2) {
		const diff = Math.floor(date1.getTime() - date2.getTime());
		const day = 1000 * 60 * 60 * 24;
		let message = '';
		const days = Math.floor(diff / day);
		if(days < 31) {
			return days + ' days ';
		}
		const months = Math.floor(days / 31);
		if(months < 12) {
			const daysLeft = days - months * 31;
			message += months + ' months and ';
			message += daysLeft + ' days ';
			return message;
		}
		const years = Math.floor(months / 12);
		const monthsLeft = months - years * 12;
		const daysLeft = days - months * 31;
		message += years + ' years, ';
		message += monthsLeft + ' months and ';
		message += daysLeft + ' days ';
		return message;
	}

	

	const m = await msg.channel.send('```Generating menu...```');
	// const info = (await (await fetch('https://api.github.com/repos/Cyber-Shores/Node/tags')).json())[0].name
	const info = (await axios.get('https://api.github.com/repos/Cyber-Shores/Node/tags')).data[0].name
	if (!args[0]) {
		const embed = new MessageEmbed({
			title: 'Help',
			description: 'Commands:',
			color: msg.member.displayHexColor,
		});
		const categories = [];
		bot.commands.forEach(command => {
			if(!categories.includes(command.help.category)) {
				categories.push(command.help.category);
			}
		});
		console.log(categories);
		categories.forEach(category => {
			const commands = [];
			bot.commands.forEach(element => {
				if(element.help.category == category) {
					let hasPerms = true;
					try {
						element.help.reqPerms.forEach(perm => {
							if(!msg.member.permissions.has(perm)) hasPerms = false;
						});
					}
					catch(e) {
						console.log(e.stack);
					}
					if(hasPerms) {
						commands.push(element.help.name);
					}
				}

			});
			console.log(commands);
			if(commands.length > 0) embed.addField(category, `\`\`\`${commands.join(', ')}\`\`\``);
		});

		new Menu(msg.channel, msg.author.id, [
			{
				name: 'main',
				content: embed,
				reactions: {
					'⏹': 'stop',
					'⚙': 'About',
				},
			},
			{
				name: 'About',
				content: new MessageEmbed({
					title: 'Our Github',
					description: 'About The Bot',
					footer: {
						text: `${bot.user.username}`,
						icon_url: `${bot.user.displayAvatarURL()}`,
					},
					timestamp: new Date(),
					color: '#07592b',
					url: 'https://github.com/Cyber-Shores/Node',
					fields: [
						{
							name: 'Developers:',
							value: `\`\`\`${bot.users.cache.get('265499320894095371').tag}\n${bot.users.cache.get('568087768530419732').tag}\n${bot.users.cache.get('393247221505851412').tag}\`\`\``,
							inline: true,
							// (Each page can only have 20 reactions, though. Discord's fault.)
						},
						{
							name: 'Lead Artist:',
							value: '```dom#9445```',
							inline: true,
						},
						{
							name: 'Node Version:',
							value: `**${info}**`,
							inline: true,
						},
						// {
						// 	name: `Commits:`,
						// 	value: `**${info.commitsSinceLastTag}**`,
						// 	inline: true,
						// }
					],
				}),
				reactions: {
					'⏹': 'stop',
					'◀': 'previous',
				},
			},
		]);
		m.delete();
	}
	else{
		let hasPerms = true;
		bot.commands.get(args[0]).help.reqPerms.forEach(perm => {
			if(!msg.member.permissions.has(perm)) hasPerms = false;
		});
		if(!hasPerms) {
			m.delete();
			return msg.channel.send(new MessageEmbed({
				title: bot.commands.get(args[0]).help.name,
				description: '```❌ You do not have access to this command```',
				color: 0xff0000,
			}));
		}
		msg.channel.send(new MessageEmbed({
			title: bot.commands.get(args[0]).help.name,
			description: `\`\`\`${bot.commands.get(args[0]).help.usage}\`\`\`\n${bot.commands.get(args[0]).help.description}`,
			fields: [
				{ name: 'Aliases', value: bot.commands.get(args[0]).help.aliases.join(', ') || 'None' },
			],
			color: msg.member.displayHexColor,

		}));
		m.delete();
	}

};

module.exports.help = {
	name: 'help',
	category: 'Tools',
	reqPerms: ['MANAGE_MESSAGES'],
	description: 'Menu with info about this bot and usage of its commands',
	usage: `${config.pref}help${config.suff} || ${config.pref}help [command]${config.suff}`,
	aliases: ['h'],
};