const config = module.require('../../config.json');
module.exports.run = async (bot, msg) => {
	if(!msg.member.hasPermission('MANAGE_MESSAGES')) return require('../../util/errMsg.js').run(bot, msg, false, 'You do not have proper perms');
	const user = msg.mentions.users.first();
	// Parse Amount
	const amount = parseInt(msg.content.split(' ')[0]) ? parseInt(msg.content.split(' ')[0]) : parseInt(msg.content.split(' ')[1]);
	if (!amount) return require('../../util/errMsg.js').run(bot, msg, true, 'Must specify a number of messages to delete.');
	if (!amount && !user) return require('../../util/errMsg.js').run(bot, msg, true, 'Must specify a user and a number of, or just a number of, messages to delete.');
	// Fetch 100 messages (will be filtered and lowered up to max amount requested)
	if(user) {
		const userchannel = msg.channel;
		userchannel.messages.fetch({
			limit: 100,
		}).then((messages) => {
			if (user) {
				const filterBy = user ? user.id : bot.user.id;
				messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
			}
			msg.channel.bulkDelete(messages).catch(error => console.log(error.stack));
		});
	}
	else{
		msg.channel.bulkDelete(amount);
	}
};

module.exports.help = {
	name: 'clear',
	category: 'Admin Tools',
	reqPerms: ['MANAGE_MESSAGES'],
	description: 'Bulk deletes a number of messages from a channels history, from a specified user or from everyone.',
	usage: `${config.pref}clear [number]${config.suff} || ${config.pref}clear [number] [user-mention]${config.suff}`,
	aliases: ['purge'],
};