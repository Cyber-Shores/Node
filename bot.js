/* eslint-disable no-inline-comments */
require('dotenv').config();
const config = require('./config.json');
const Discord = require('discord.js');
const { Client, MessageEmbed } = require('discord.js');
const bot = new Client();
const fs = require('fs');
const mongoose = require('mongoose');
const GuildModel = require('./models/GuildData');
// eslint-disable-next-line no-unused-vars
const { maxHeaderSize } = require('http');
// eslint-disable-next-line no-unused-vars
const wait = require('./util/wait').run;
const queueMessage = require('./util/queueMessage.js').run;
const Canvas = require('canvas');

const queue = []; // Queue of messages sent EVERYWHERE, it auto deletes after a time though

// const DBL = require("dblapi.js");  (WIP) cannot finish until bot gets approved on top.gg
// const dbl = new DBL('', bot);

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

// #region start of connecting to database
// process.env.MONGOLINK used to hide password
mongoose.connect(process.env.MONGOLINK, {
	// mongo connect settings
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
	// end
}).then(console.log('\nMongoDB connected!\n'));
// #endregion end

// #region start of command reading
fs.readdir('./cmds/', (err, folders) => {
	folders.forEach(item => {
		fs.readdir(`./cmds/${item}`, (err, files) => {
			if(err) console.error(err);

			const jsfiles = files.filter(f => f.split('.').pop() === 'js');
			if(jsfiles.length <= 0) {
				console.log(`No commands to load in ${item}!`);
				return;
			}

			console.log(`Loading ${jsfiles.length} commands from ${item}!`);

			jsfiles.forEach((f, i) => {
				const props = require(`./cmds/${item}/${f}`);
				console.log(`${i + 1} ${f}!`);
				bot.commands.set(props.help.name, props);
				props.help.aliases.forEach(alias => {
					bot.aliases.set(alias, props.help.name);
				});
			});
		});

	});
});
// #endregion

// #region Getting stuff prepared for ready
bot.once('ready', () => {
	// first status set for `ready`
	const CLIENTGUILDS = bot.guilds.cache.filter(guild => guild);
	bot.user.setActivity(`For <prefix> in ${CLIENTGUILDS.size} servers!`, { type: 'WATCHING' });
	// end
	// Creating a doc for each guild if one is not already made
	CLIENTGUILDS.forEach(async guild => {
		const req = await GuildModel.findOne({ id: guild.id });
		if (req) return;
		const doc = new GuildModel({ id: guild.id });
		await doc.save();
		console.log('Guild Doc Created!');
		// end
	});
});
// #endregion

// #region Canvas join message
const applyText = (canvas, text, size) => {
	const ctx = canvas.getContext('2d');
	let fontSize = size;
	do {
		ctx.font = `${fontSize -= 10}px sans-serif`;
	} while (ctx.measureText(text).width > canvas.width - 300);

	return ctx.font;
};
// #endregion

// #region the canvas thigny
bot.on('guildMemberAdd', async member => {
	const channel = member.guild.systemChannel;
	if(!channel) return;
	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');


	const background = await Canvas.loadImage('./docs/images/tech-banner.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = '#1c1c21';
	ctx.fillRect((canvas.width / 2.5) - 10, (canvas.height / 3.5) - 35, canvas.width - (canvas.width / 2.5) - 5, canvas.height - (canvas.height / 3.5) - 50);

	ctx.font = applyText(canvas, `Welcome to ${member.guild.name},`, 38);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`Welcome to ${member.guild.name},`, canvas.width / 2.5, canvas.height / 3.5);

	ctx.font = applyText(canvas, member.displayName, 70);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.8);

	// ctx.beginPath();
	// ctx.arc(125, 125, 100, 0, Math.PI*2, true);
	// ctx.closePath();
	// ctx.clip();

	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.jpg');
	// eslint-disable-next-line no-unused-vars
	const embed = new MessageEmbed({
		title: `Welcome to ${member.guild.name}, ${member.user.username}`,
		footer: {
			'text': member.user.username,
			'icon_url': member.user.displayAvatarURL(),
		},
		timestamp: Date.now(),
		color: 0x07592b,
	});
	channel.send(attachment);
});
// #endregion

// #region Things to do on guild join
bot.on('guildCreate', async joinedGuild => {
	// activity set
	const CLIENTGUILDS = bot.guilds.cache.filter(guild => guild);
	bot.user.setActivity(`For prefix in ${CLIENTGUILDS.size} servers!`, { type: 'WATCHING' });
	// end
	// creating a doc for each guild joined while on.
	const req = await GuildModel.findOne({ id: joinedGuild.id });
	if (req) return;
	const doc = new GuildModel({ id: joinedGuild.id });
	await doc.save();
	console.log('Doc Created');
	// end
});
// #endregion

// #region Stuff to do on guild leave
bot.on('guildDelete', async joinedGuild => {
	// deletes server from db
	const req = await GuildModel.findOne({ id: joinedGuild.id });
	if (!req) return;
	await req.deleteOne({ id: joinedGuild.id, fuction(err) {
		if(err) throw err;
	} });
	console.log('Doc Removed');
	// end
});
// #endregion

// #region Custom Prefixes
// bot.on('message', async msg => {
// 	if(!msg.guild) return;
// 	if(msg.author.bot) return;
// 	// rudementary command handler
// 	if (msg.content === '<prefix>') {

// 		const req = await GuildModel.findOne({ id: msg.guild.id });
// 		if (!req) return require('./util/errMsg').run(bot, msg, true, 'Something went wrong while loading your servers prefix/suffix\nPlease report this to our support server: https://discord.gg/GUvk7Qu');
// 		const prefixembed = new Discord.MessageEmbed({
// 			title: 'Server Prefix & Suffiix:',
// 			description: `Prefix:  ${req.prefix}\nSuffix:  ${req.suffix}\n`,
// 			color: msg.member.displayHexColor,
// 			footer: {
// 				'text': msg.author.username,
// 				'icon_url': msg.author.displayAvatarURL(),
// 			},
// 			timestamp: Date.now(),
// 		});

// 		return msg.channel.send(prefixembed);

// 	}
// end
// });
// #endregion

// #region Final ready
bot.on('ready', async () => {
	console.log(`${bot.user.username} is online!`);
	console.log(`Prefix hardcoded as ${process.env.PREFIX || "default"}, Suffex hardcoded as ${process.env.SUFFIX || "defualt"}`)
});
// #endregion

// #region Primary command identifier
bot.on('message', async msg => {
	if(msg.author.bot) return;
	if(msg.channel.type === 'dm') return;

	if (msg.content === '<prefix>') {
		const req = await GuildModel.findOne({ id: msg.guild.id });
		if (!req) return require('./util/errMsg').run(bot, msg, true, 'Something went wrong while loading your servers prefix/suffix\nPlease report this to our support server: https://discord.gg/GUvk7Qu');
		const prefixembed = new Discord.MessageEmbed({
			title: 'Server Prefix & Suffiix:',
			description: `Prefix:  ${req.prefix}\nSuffix:  ${req.suffix}\n`,
			color: msg.member.displayHexColor,
			footer: {
				'text': msg.author.username,
				'icon_url': msg.author.displayAvatarURL(),
			},
			timestamp: Date.now(),
		});
		return msg.channel.send(prefixembed);
	}
	else if(msg.content === '<prefix reset>') {
		await GuildModel.findOneAndUpdate({ id: msg.guild.id }, { $set: { suffix: '>' } }, { new: true });
		await GuildModel.findOneAndUpdate({ id: msg.guild.id }, { $set: { prefix: '<' } }, { new: true });
		const setprefixembed = await new MessageEmbed({
			title: 'Prefix Reset!',
			description: 'Prefix: <\nSuffix: >\n',
			color: msg.member.displayHexColor,
			footer: {
				'text': msg.author.username,
				'icon_url': msg.author.displayAvatarURL(),
			},
			timestamp: Date.now(),
		});
		return await msg.channel.send(setprefixembed);
	}

	const req = await GuildModel.findOne({ id: msg.guild.id });
	if(!!process.env.PREFIX) {req.prefix = process.env.PREFIX;}
	if(!!process.env.SUFFIX) {req.suffix = process.env.SUFFIX;}
	console.log(req.suffix, req.prefix)
	let args = '';

	// if(msg.content.includes(req.prefix) && msg.content.includes(req.suffix)) {args = msg.content.slice(msg.content.indexOf(req.prefix) + req.prefix.length, msg.content.indexOf(req.suffix)).trim().split(/ +/g);}
	if(msg.content.includes(req.prefix) && msg.content.includes(req.suffix)) {args = msg.content.match(new RegExp(`(?<=${req.prefix}).+?(?=${req.suffix})`))[0].trim().split(/ +/g)}
	else {return;}

	// console.log(queue.map(_ => _.msg.author.username))
	try {
		// eslint-disable-next-line max-statements-per-line
		await new Promise(resolve => queue.push(new queueMessage(msg, () => queue, qM => {queue.splice(queue.indexOf(qM), 1); resolve();})));
	}
	catch (e) {
		console.log(e);
		queue.push(new queueMessage(msg, () => queue, qM => queue.splice(queue.indexOf(qM), 1), true));
		queueMessage.delete(msg);
		await msg.react('❌');
		return; // Returns if they spam quite a bit
	}

	const cmd = args.shift().toLowerCase();

	let command;
	if(bot.commands.has(cmd)) {command = bot.commands.get(cmd);}
	else {command = bot.commands.get(bot.aliases.get(cmd));}
	if(command && command.help.reqPerms.every(perm => msg.guild.me.hasPermission(perm))) command.run(bot, msg, args, config);
	// eslint-disable-next-line no-useless-escape
	else if(!command.help.reqPerms.every(perm => msg.guild.me.hasPermission(perm))) require('./util/errMsg.js').run(bot, msg, false, 'This bot does not have proper permissions.' + 'To run this command, either make sure that the bot has these perms: \`' + command.help.reqPerms.join(', ') + '\` or reinvite the bot using the command ' + `\`${config.pref}invitation ${command.help.reqPerms.join(' ')}${config.suff}\``);
});
// #endregion

// #region  Node Network
bot.on('message', async msg => {

	if(msg.author.bot) return;
	if(msg.channel.type === 'dm') return;
	if(msg.channel.name != 'node-network') return;

	// creates new node network message
	const embed = new MessageEmbed({
		author: {
			name: msg.author.username,
			icon_url: msg.author.displayAvatarURL(),
		},
		description: msg.content,
		color: msg.member.displayHexColor,
		footer: {
			text: msg.guild.name,
			icon_url: msg.guild.iconURL(),
		},
	});
	const attachment = msg.attachments.first();
	if(attachment) embed.setImage(attachment.url);
	// end

	// sending
	bot.guilds.cache.filter(g => g != msg.guild && g.channels.cache.find(c => c.name == 'node-network')).array().forEach(g => g.channels.cache.find(c => c.name == 'node-network').send(embed));
	// end
});
// #endregion

// #region determines which token you are using
// test bot if not in production, defaualts to production -- Hamziniii 🎩
if(process.env.PRODUCTION == "false") {
	if(!process.env.BOT)
		console.log("Please set BOT equal to TESTTOKEN, TEST2TOKEN, or TEST3TOKEN in your env file")
	else if(!!process.env[process.env.BOT])
		bot.login(process.env[process.env.BOT])
	else
		console.log(process.env.BOT + " is not set in your .env file")
}
else {
	console.log('production')
	bot.login(process.env.TOKEN);
}
// #endregion