const Discord = module.require('discord.js');
const config = module.require('../../config.json');
const UserModel = require('../../models/UserBio');
module.exports.run = async (bot, msg, args) => {
    const m = await msg.channel.send('```Locating Data...```');
	const req = await UserModel.findOne({ id: msg.author.id });
	let nodata = new Discord.MessageEmbed({
		title: 'Data Clear!',
			description: `No data found on ${msg.author.tag}`,
			footer: {
				text: `${msg.author.username}`,
				icon_url: `${msg.author.displayAvatarURL()}`,
			},
			timestamp: new Date(),
			color: (msg.member.displayHexColor),
		});

	if (!req) {
		m.delete();
		return msg.channel.send(nodata)
	}else {
		m.delete()
		const m2 = await msg.channel.send('```Deleting Data...```');
		let embed = new Discord.MessageEmbed({
			title: 'Data Cleared!',
			description: `All of ${msg.author.tag}'s data has been deleted!`,
			footer: {
				text: `${msg.author.username}`,
				icon_url: `${msg.author.displayAvatarURL()}`,
			},
			timestamp: new Date(),
			color: (msg.member.displayHexColor),
		});

		await req.deleteOne({ id: msg.author.id, fuction(err) {
		
		if(err) throw err;
		}
	});
	m2.delete();
	msg.channel.send(embed)
	
}


};

module.exports.help = {
	name: 'cleardata',
	category: 'Tools',
	reqPerms: [],
	description: 'Clears all of your user data that Node is storing.',
	usage: `${config.pref}cleardata${config.suff}`,
	aliases: [],
};