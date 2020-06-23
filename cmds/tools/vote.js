const config = module.require('../../config.json');
const { Menu } = module.require('discord.js-menu');
const { MessageEmbed } = module.require('discord.js');
const ms = module.require('ms');
module.exports.run = async (bot, msg, args) => {
	// await msg.channel.send("```Awaiting...```");
	// const msgs = await msg.channel.awaitMessages(msg => msg.content.includes("hi"), {time: 5000});
	// msg.channel.send(`\`\`\`✅ Await completed! ${msgs.map(msg => msg.content).join(", ")}\`\`\``);
	try {
		let time = args.join(' ');
		if(time == '') time = '15s';
		if(!isNaN(time)) {
			time = ms(parseInt(time, 10), { long:true });
		}
		if(ms(time) < 15000) time = '15 seconds';
		if(ms(time) > 2.074e+9) time = '24 days';
		const m = await msg.channel.send(new MessageEmbed({
			title: 'Vote!',
			description: `Time: ${ms(ms(time), { long: true }) || ''}`,
			color: msg.member.displayHexColor,
		}));
		const agree = '✅';
		const disagree = '❌';
		m.react(agree);
		m.react(disagree);
		const reactions = await m.awaitReactions(reaction => reaction.emoji.name === agree || reaction.emoji.name === disagree, { time: ms(time) || 15000 });
		const wait = await msg.channel.send('```Generating results...```');
		const embedMain = new MessageEmbed({
			title: 'Ballot Box',
			description: 'Heres how the vote went\n',
			color: msg.member.displayHexColor,
		});
		const embedYes = new MessageEmbed({
			title: `Who Voted     ${agree}`,
			color: 0x00d924,
		});
		const embedNo = new MessageEmbed({
			title: `Who Voted     ${disagree}`,
			color: 0xdb0202,
		});
		const total = new Array();
		reactions.forEach(reaction => {
			const people = reaction.users.cache.filter(u => u.id != bot.user.id);
			people.forEach(p => {
				if(!total.includes(p.username)) total.push(p.username);
			});
		});
		if(total.length < 1) {
			embedMain.setDescription('⚠️ No one voted');
		}
		else{
			embedMain.setDescription(total);
		}

		const yesVoters = new Array();
		const noVoters = new Array();
		await reactions.get(agree).users.cache.forEach(u => {
			if(u.id != bot.user.id) {
				yesVoters.push(u.username);
			}
		});
		if(yesVoters.length < 1) {
			embedYes.setDescription('No one voted');
		}
		else{
			embedYes.setDescription(yesVoters);
		}
		await reactions.get(disagree).users.cache.forEach(u => {
			if(u.id != bot.user.id) {
				noVoters.push(u.username);
			}
		});
		if(noVoters.length < 1) {
			embedNo.setDescription('No one voted');
		}
		else{
			embedNo.setDescription(noVoters);
		}
		new Menu(msg.channel, msg.author.id, [
			{
				name: 'main',
				content: embedMain,
				reactions: {
					'⏹️': 'stop',
					'✅': 'yes',
					'❌': 'no',
				},
			},
			{
				name: 'yes',
				content: embedYes,
				reactions: {
					'⏹️': 'stop',
					'❌': 'no',
					'◀️': 'main',
				},
			},
			{
				name: 'no',
				content: embedNo,
				reactions: {
					'⏹️': 'stop',
					'✅': 'yes',
					'◀️': 'main',
				},
			},
		]);
		wait.delete();
		m.delete();
	}
	catch(e) {
		return require('../../util/errMsg.js').run(bot, msg, true, 'Make sure the vote time is between 15 seconds and 30 days');
	}
	// msg.channel.send(`\`\`\`Voting complete! \n${agree}: ${reactions.get(agree).count-1}\n${disagree}: ${reactions.get(disagree).count-1}\`\`\``);
};

module.exports.help = {
	name: 'vote',
	category: 'Tools',
	reqPerms: [],
	description: 'Posts a ballot box that collects votes for \'✅\' or \'❌\'. After a provided amount of time (default 15 secs), a menu will be provided detailing the results of the ballot.\nVote time must be longer than 15 seconds or shorter than 25 days. Beware long vote times, if the bot is updated before the end of the vote, the menu will not trigger',
	usage: `${config.pref}vote${config.suff} || ${config.pref}vote [time (e.g. 15s or 15000)]${config.suff}`,
	aliases: ['v', 'ballot', 'ballotBox'],
};