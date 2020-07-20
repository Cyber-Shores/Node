/* eslint-disable no-useless-escape */
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const urban = module.require('urban');
const { MessageEmbed } = module.require('discord.js');
const config = module.require('../../config.json');
// eslint-disable-next-line no-unused-vars
const { Menu } = module.require('discord.js-menu');
module.exports.run = async (bot, msg, args) => {
	if (!msg.channel.nsfw) {return require('../../util/errMsg.js').run(bot, msg, true, `You can\'t use this in a SFW channel. Use this in a NSFW channel like: ${msg.guild.channels.cache.array().filter(c => c.type == 'text').filter((c) => c.nsfw).map(c => c.name).join(', ')}`);}
	if (!args[0]) {return require('../../util/errMsg.js').run(bot, msg, true, 'Please provide a term to search');}
	// msg.channel.send("```⚠️ Please provide a term to search```");
	if (args[0] == 'random') {
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
	else {
		const str = args.join(' ');
		urban(str).first(json => {
			if (!json) {return require('../../util/errMsg.js').run(bot, msg, false, 'No results found');}
			const embed = new MessageEmbed()
				.setTitle(json.word || str)
				.setColor(msg.member.displayHexColor)
				.setDescription(json.definition || '```⚠️ Definition Not Found```')
				.addField('Upvotes', json.thumbs_up || 'NaN', true)
				.addField('Downvotes', json.thumbs_down || 'NaN', true)
				.setFooter(`Definition written by ${json.author}`);
			msg.channel.send(embed);
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
