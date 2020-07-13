const urban = module.require('urban');
const { MessageEmbed } = module.require('discord.js');
const config = module.require('../../config.json');
// eslint-disable-next-line no-unused-vars
const { Menu } = module.require('discord.js-menu');

module.exports.run = async (bot, msg, args) => {
	if(!msg.channel.nsfw) return require('../../util/errMsg.js').run(bot, msg, true, 'You can\'t use this in a SFW channel.');
	if(!args[0]) return require('../../util/errMsg.js').run(bot, msg, true, 'Please provide a term to search');

	// msg.channel.send("```⚠️ Please provide a term to search```");
	if(args[0] == 'random') {
		urban.random().first(json => {
			const embed = new MessageEmbed()
				.setTitle(json.word)
				.setDescription(json.definition || '```⚠️ Definition Not Found```')
				.addField('Upvotes', json.thumbs_up || 'NaN', true)
				.addField('Downvotes', json.thumbs_down || 'NaN', true)
				.setFooter(`Definition written by ${json.author}`);
			msg.channel.send(embed);
		});
	}
	else{
		const str = args.join(' ');
		urban(str).first(json => {
			if(!json) return require('../../util/errMsg.js').run(bot, msg, false, 'No results found');
			const embed = new MessageEmbed()
				.setTitle(json.word || str)
				.setColor(msg.member.displayHexColor)
				.setDescription(json.definition || '```⚠️ Definition Not Found```')
				.addField('Upvotes', json.thumbs_up || 'NaN', true)
				.addField('Downvotes', json.thumbs_down || 'NaN', true)
				.setFooter(`Definition written by ${json.author}`);
			msg.channel.send(embed);
			// new Menu(msg.channel, msg.author.id, [
			// 	{
			// 		name: 'one',
			// 		content: new MessageEmbed({
			// 			title: '',
			// 			description: 'Commands list:',
			// 			fields: [
			// 				{
			// 					name: 'command1',
			// 					value: 'this command does stuff',
			// 				},
			// 			],
			// 		}),
			// 		reactions: {
			// 			'2️⃣': 'two',
			// 			'3️⃣': 'three',
			// 			'4️⃣': 'four',
			// 		},
			// 	},
			// 	{
			// 		name: 'two',
			// 		content: new MessageEmbed({
			// 			title: 'More Help!',
			// 			description: 'Here are some more commands!',
			// 			fields: [
			// 				{
			// 					name: 'You get the idea.',
			// 					value: 'You can create as many of these pages as you like.',
			// 					// (Each page can only have 20 reactions, though. Discord's fault.)
			// 				},
			// 			],
			// 		}),
			// 		reactions: {
			// 			'1️⃣': 'one',
			// 			'3️⃣': 'three',
			// 			'4️⃣': 'four',
			// 		},
			// 	},
			// 	{
			// 		name: 'three',
			// 		content: new MessageEmbed({
			// 			title: 'More Help!',
			// 			description: 'Here are some more commands!',
			// 			fields: [
			// 				{
			// 					name: 'You get the idea.',
			// 					value: 'You can create as many of these pages as you like.',
			// 					// (Each page can only have 20 reactions, though. Discord's fault.)
			// 				},
			// 			],
			// 		}),
			// 		reactions: {
			// 			'1️⃣': 'one',
			// 			'2️⃣': 'two',
			// 			'4️⃣': 'four',
			// 		},
			// 	},
			// 	{
			// 		name: 'four',
			// 		content: new MessageEmbed({
			// 			title: 'More Help!',
			// 			description: 'Here are some more commands!',
			// 			fields: [
			// 				{
			// 					name: 'You get the idea.',
			// 					value: 'You can create as many of these pages as you like.',
			// 					// (Each page can only have 20 reactions, though. Discord's fault.)
			// 				},
			// 			],
			// 		}),
			// 		reactions: {
			// 			'1️⃣': 'one',
			// 			'2️⃣': 'two',
			// 			'3️⃣': 'three',
			// 		},
			// 	},
			// ]);
		});
	}
};

module.exports.help = {
	name: 'urban',
	category: 'Misc.',
	reqPerms: [],
	description: 'Posts the urban dictionary entry for a provided search term, or a random search if the term is "random" ',
	usage: `${config.pref}urban [term]${config.suff}`,
	aliases: ['urb', 'urbanDictionary', 'dictionary', 'search'],
};