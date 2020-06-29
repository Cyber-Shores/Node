const Discord = module.require('discord.js');
const config = module.require('../../config.json');
const sf = require('snekfetch');

module.exports.run = async (bot, msg, args) => {
	if(!args[0]) return msg.channel.send('Please provide a subreddit name');
	const m = await msg.channel.send('```Generating image...```');

	sf.get(`https://www.reddit.com/r/${args[0]}/random.json?limit=1`).then(res => {
		if(!res.body) {
			m.delete();
			return msg.channel.send(`No Post could be found!`)
		}
		const url = res.body[0].data.children[0].data.url
		// console.log(res.body[0].data.children[0].data.over_18)
		// console.log(msg.channel.nsfw)

		if(res.body[0].data.children[0].data.over_18 == true) {
			if(msg.channel.nsfw) {
				const nsfwembed = new Discord.MessageEmbed();
				nsfwembed
					.setTitle(`Post From r/${args[0]}`)
					.setColor(msg.author.displayHexColor)
					.setImage(url)

				
				m.delete();
				return msg.channel.send(nsfwembed)
			}else{
				m.delete();
				return require('../../util/errMsg.js').run(bot, msg, false, 'This channel is not NSFW!');
			}
		}

		const sfwembed = new Discord.MessageEmbed();
				sfwembed
					.setTitle(`Post From r/${args[0]}`)
					.setColor(msg.author.displayHexColor)
					.setImage(url)
		m.delete();
		msg.channel.send(sfwembed)
		console.log(url)

		
		
		
		
	});
};

module.exports.help = {
	name: 'reddit',
	category: 'Misc.',
	reqPerms: [],
	description: 'Gets a post from a subreddit',
	usage: `${config.pref}reddit [subreddit excluding r/]${config.suff}`,
	aliases: ['r/'],
};