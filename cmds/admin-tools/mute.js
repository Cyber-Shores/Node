const Discord = module.require('discord.js');
const config = module.require('../../config.json');
const ms = module.require('ms');
module.exports.run = async (bot, msg, args) => { // TODO: What if you cant add roles (im too tired to add the todos for all the other files)

	if(!msg.member.hasPermission('MANAGE_MESSAGES')) return require('../../util/errMsg.js').run(bot, msg, false, 'You do not have proper premissions.');

	const USER = msg.mentions.members.first();
	if(!USER) return require('../../util/errMsg.js').run(bot, msg, true, 'Please mention a user');
	if(USER.id == msg.author.id) return require('../../util/errMsg.js').run(bot, msg, false, 'You cannot mute youself!');
	if(USER.roles.highest.position >= msg.member.roles.highest.position) return require('../../util/errMsg.js').run(bot, msg, false, 'Target user is of higher ranking then you!');
	let ROLE = msg.guild.roles.cache.find(r => r.name === 'Node Muted');

	if(!ROLE) {
		try {
			ROLE = await msg.guild.roles.create({
				data: {
					name: 'Node Muted',
					color: 'GREY',
				},
				reason: 'Because Muted Role Is Necessary For Command Usage',
			});
			msg.guild.channels.cache.forEach(async (channel) => {
				await channel.updateOverwrite(ROLE, {
					SEND_MESSAGES: false,
					ADD_REACTIONS: false,
					CONNECT: false,
				});
			});
		}
		catch(e) {
			console.log(e.stack);
		}
	}
	if(USER.roles.cache.has(ROLE.id)) return require('../../util/errMsg.js').run(bot, msg, false, `${USER} is already muted!`);
	const succesembed = new Discord.MessageEmbed({
		title: '**Mute**',
		description: `${USER} was succesfully muted!`,
		footer: {
			text: `${msg.author.username}`,
			icon_url: `${msg.author.displayAvatarURL()}`,
		},
		timestamp: new Date(),
		color: (msg.member.displayHexColor),
	});
	if(!args[1]) {
		await USER.roles.add(ROLE);
		msg.channel.send(succesembed);
	}
	else{
		const time = args[0];
		await USER.roles.add(ROLE);

		msg.channel.send(succesembed);
		setTimeout(() => {
			if(!USER.roles.cache.has(ROLE.id)) return;
			USER.roles.remove(ROLE);
			const unmuteembed = new Discord.MessageEmbed({
				title: '**Unmute',
				description: `${USER} has been unmuted!`,
				footer: {
					text: `${msg.author.username}`,
					icon_url: `${msg.author.displayAvatarURL()}`,
				},
				timestamp: new Date(),
				color: (msg.member.displayHexColor),
			});
			msg.channel.send(unmuteembed);
		}, ms(time));
	}

};

module.exports.help = {
	name: 'mute',
	category: 'Admin Tools',
	reqPerms: ['MANAGE_MESSAGES'],
	description: 'Mutes a specified user!',
	usage: `${config.pref}mute [optional-time] [user-mention]${config.suff}`,
	aliases: [],
};