const urban = module.require('urban');
const { MessageEmbed } = module.require('discord.js');
const config = module.require('../../config.json');
module.exports.run = async (bot, msg, args) => {
	if(!args[0]) return require('../../util/errMsg.js').run(bot, msg, true, 'Please provide a term to search');
	// msg.channel.send("```⚠️ Please provide a term to search```");

	const str = args.join(' ');

	urban(str).first(json => {
		if(!json) return require('../../util/errMsg.js').run(bot, msg, false, 'No results found');
		const embed = new MessageEmbed()
			.setTitle(json.word || str)
			.setColor(msg.member.displayHexColor)
			.setDescription(json.definition || '```⚠️ Definition Not Found```')
			.addField('Upvotes', json.thumbs_up || 'NaN', true)
			.addField('Downvotes', json.thumbs_down || 'NaN', true)
			.setFooter(`Written by ${json.author}`);
		msg.channel.send(embed);
	});

	// if(args[0] == 'random') {

	// }else{
	//     urban.random().first(json => {
	//         let embed = new MessageEmbed()
	//             .setTitle(json.word || str)
	//             .setDescription(json.definition || "```⚠️ Definition Not Found```")
	//             .addField("Upvotes", json.thumbs_up || "NaN", true )
	//             .addField("Downvotes", json.thumbs_down || "NaN", true)
	//             .setFooter(`Written by ${json.author}`);
	//         msg.channel.send(embed);
	//     });
	// }
};

module.exports.help = {
	name: 'urban',
	category: 'Misc.',
	reqPerms: [],
	description: 'Posts the urban dictionary entry for a provided search term, or a random search if the term is "random" ',
	usage: `${config.pref}urban [term]${config.suff}`,
	aliases: ['urb', 'urbanDictionary', 'dictionary', 'search'],
};