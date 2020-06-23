const { MessageEmbed } = require('discord.js');
const { default: Axios } = require('axios');

const snek = module.require('snekfetch');
const config = module.require('../../config.json');
module.exports.run = async (bot, msg) => {
	const m = await msg.channel.send('```Generating image...```');
	const file = (await snek.get('http://aws.random.cat/meow')).body.file;
	if(!file) return require('../../util/errMsg.js').run(bot, msg, true, 'I broke! Please try again or contact the developer!');

	// const attach = await new Discord.MessageAttachment(file, file.split('/').pop());
	let desc = '';
	await Axios.get('https://catfact.ninja/fact').then(async body => {
		desc = body.data.fact;
	});

	msg.channel.send(new MessageEmbed({
		description: `${desc}\n(image unrelated)`,
		image: {
			url: file,
		},
		color: msg.member.displayHexColor,
		timestamp: new Date(),
		footer: {
			text: `${msg.author.username}`,
			icon_url: `${msg.author.displayAvatarURL()}`,
		},
	}));
	m.delete();
};

module.exports.help = {
	name: 'cat',
	category: 'Misc.',
	reqPerms: [],
	description: 'Posts a random cat image',
	usage: `${config.pref}cat${config.suff}`,
	aliases: ['kitten', 'kitty'],
};