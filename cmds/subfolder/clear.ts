// Unfinished
// utils need to be fixed

import { Collection, TextChannel, Message } from "discord.js";
import { machinaDecoratorInfo, MachinaFunction, MachinaFunctionParameters, MachinaMessage } from "machina.ts"
export const randomNumber: MachinaFunction = machinaDecoratorInfo
    ({monikers: ["purge", "clear"], description: "Bulk deletes a number of messages from a channels history. From a specified user or from everyone."})
    ("Admin-Tool", "clear", async (params: MachinaFunctionParameters) => {

		const NONADMINMAX = 10 // The amount of messages that people without admin but with manage message perms can delete
		// if(!msg.member.hasPermission('MANAGE_MESSAGES')) return require('../../util/errMsg.js').run(bot, msg, false, 'You do not have proper perms');
		const user = params.msg.mentions.users.first();
		// Parse Amount
		let amount;
		let previousAmount = amount = parseInt(params.msg.content.split(' ')[0]) ? parseInt(params.msg.content.split(' ')[0]) : parseInt(params.msg.content.split(' ')[1]);
		// if (!amount) return require('../../util/errMsg.js').run(bot, msg, true, 'Must specify a number of messages to delete.');
		// if (!amount && !user) return require('../../util/errMsg.js').run(bot, msg, true, 'Must specify a user and a number of, or just a number of, messages to delete.');

		// Fetch 100 messages (will be filtered and lowered up to max amount requested)
		if(!params.msg.member.hasPermission("ADMINISTRATOR"))
			if((amount = Math.min(amount, NONADMINMAX)) != previousAmount)
				// require('../../util/suggestMsg.js').run(bot, msg, 'Delete count is capped at ' + NONADMINMAX + ' for non admins. I just thought I would let you know :)').then(_ => _.delete({timeout: 5000}))
	
		if(user) {
			const userchannel = (params.msg.channel as TextChannel);
			userchannel.messages.fetch({
				limit: 100,
			}).then((messages) => {
				let messageArr;
				if (user) {
					const filterBy = user ? user.id : params.Bot.client.user.id;
					messageArr = (messages.filter(m => m.author.id === filterBy).array().slice(0, amount) as Message[]);
				}
				(params.msg.channel as TextChannel).bulkDelete(messageArr).catch(error => console.log(error.stack));
			});
		}
		else{
			(params.msg.channel as TextChannel).bulkDelete(amount);
		}

    });           