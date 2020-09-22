const { MessageEmbed } = require('discord.js');
const config = module.require('../../config.json');
const cheerio = module.require('cheerio');
const request = module.require('request');
module.exports.run = async (bot, msg, args) => {
	if(!args[0]) return require('../../util/errMsg.js').run(bot, msg, true, 'Please provide a search term.');
	const m = await msg.channel.send('```Generating image...```');
	const options = {
		// eslint-disable-next-line no-inline-comments
		url: encodeURI('http://results.dogpile.com/serp?qc=images&q=' + args.join(' ')), // + args.join('%20'),
		method: 'GET',
		headers: {
			'Accept':  'text/html',
			'User-Agent': 'Chrome',
		},
	};
	request(options, function(error, response, responseBody) {
		if (error) return require('../../util/errMsg.js').run(bot, msg, false, 'Something went wrong, please report this in our support server:\nhttps://discord.gg/GUvk7Qu');
		const $ = cheerio.load(responseBody);
		const links = $('.image a.link');
		const urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr('href'));
		if(!urls.length) {
			m.delete();
			return require('../../util/errMsg.js').run(bot, msg, false, `No results for "${args.join(' ')}"`);
		}
		const url = urls[Math.floor(Math.random() * urls.length)];
		m.delete();
		msg.channel.send(new MessageEmbed({
			title: args.join(' '),
			url: url,
			image: {
				url: url,
			},
			color: msg.member.displayHexColor,
			timestamp: new Date(),
			footer: {
				text: `${msg.author.username}`,
				icon_url: `${msg.author.displayAvatarURL()}`,
			},
		}));
	});
};

module.exports.help = {
	name: 'image',
	category: 'Tools',
	reqPerms: [],
	description: 'Searches google for a provided term and returns a random result.',
	usage: `${config.pref}image [search term]${config.suff}`,
	aliases: ['img'],
};