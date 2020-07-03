const { MessageEmbed } = module.require('discord.js');
const config = module.require('../../config.json');
module.exports.run = async (bot, msg) => {
	try {
		const link = await bot.generateInvite([
			'CREATE_INSTANT_INVITE'
			, 'KICK_MEMBERS'
			,'BAN_MEMBERS'
			,'MANAGE_CHANNELS'
			,'MANAGE_GUILD'
			,'ADD_REACTIONS'
			,'VIEW_AUDIT_LOG'
			,'PRIORITY_SPEAKER'
			,'STREAM'
			,'VIEW_CHANNEL'
			,'SEND_MESSAGES'
			,'SEND_TTS_MESSAGES'
			,'MANAGE_MESSAGES'
			,'EMBED_LINKS'
			,'ATTACH_FILES'
			,'READ_MESSAGE_HISTORY'
			,'MENTION_EVERYONE'
			,'USE_EXTERNAL_EMOJIS'
			,'VIEW_GUILD_INSIGHTS'
			,'CONNECT'
			,'SPEAK'
			,'MUTE_MEMBERS'
			,'DEAFEN_MEMBERS'
			,'MOVE_MEMBERS'
			,'USE_VAD'
			,'CHANGE_NICKNAME'
			,'MANAGE_NICKNAMES'
			,'MANAGE_ROLES'
			,'MANAGE_WEBHOOKS'
			,'MANAGE_EMOJIS'
		]);
		const embed = new MessageEmbed({
			color: msg.member.displayHexColor,
			author: {
				name: 'Join The Support Server!',
				url: 'https://discord.gg/GUvk7Qu',
			},
			description: "https://discordbotlist.com/bots/node",
			image: {
				url: bot.user.displayAvatarURL(),
			},
			title: 'Add the bot!',
			url: link,
			timestamp: new Date(),
			footer: {
				text: `${msg.author.username}`,
				icon_url: `${msg.author.displayAvatarURL()}`,
			},
		});
		msg.channel.send(embed);
	}
	catch(e) {
		console.log(e.stack);
	}
};

module.exports.help = {
	name: 'invite',
	category: 'Tools',
	reqPerms: [],
	description: 'Sends an invite link',
	usage: `${config.pref}invite${config.suff}`,
	aliases: ['link'],
};
