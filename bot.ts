/* eslint-disable no-inline-comments */
require('dotenv').config();
import config = require('./config.json');

import { Machina, extractClasses, arrify, MachinaFunction, MachinaMessage } from "machina.ts";
const Bot = new Machina(process.env.TOKEN, "&")

import Discord = require('discord.js');
import fs = require('fs');
import mongoose = require('mongoose');
import GuildModel = require('./models/GuildData');
// eslint-disable-next-line no-unused-vars
import { maxHeaderSize } from 'http';
import { TextChannel } from 'discord.js';
// eslint-disable-next-line no-unused-vars
const wait = require('./util/wait').run;
import * as qM from './util/queueMessage'
const queueMessage = qM.run;

const queue = []; // Queue of messages sent EVERYWHERE, it auto deletes after a time though

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

			const tsfiles = files.filter(f => f.split('.').pop() === 'ts');
			if(tsfiles.length <= 0) {
				console.log(`No commands to load in ${item}!`);
				return;
			}

			console.log(`Loading ${tsfiles.length} commands from ${item}!`);

			tsfiles.forEach((f, i) => {
				const props = require(`./cmds/${item}/${f}`);
				console.log(`${i + 1} ${f}!`);
				Bot.loadCommands(...(Object.values(props) as MachinaFunction[]));
			});
		});

	});
});
// #endregion

Bot.initizalize();

// #region Getting stuff prepared for ready
Bot.client.once('ready', async () => {
	// first status set for `ready`
	const CLIENTGUILDS = Bot.client.guilds.cache;
	Bot.client.user.setActivity(`For <prefix> in ${CLIENTGUILDS.size} servers!`, { type: 'WATCHING' });
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

// #region Things to do on guild join
Bot.client.on('guildCreate', async joinedGuild => {
	// activity set
	const CLIENTGUILDS = Bot.client.guilds.cache;
	Bot.client.user.setActivity(`For prefix in ${CLIENTGUILDS.size} servers!`, { type: 'WATCHING' });
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
Bot.client.on('guildDelete', async joinedGuild => {
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
// Bot.client.on('message', async msg => {
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
Bot.client.on('ready', async () => {
	console.log(`${Bot.client.user.username} is online!`);
	console.log(`Prefix hardcoded as ${process.env.PREFIX || "default"}, Suffex hardcoded as ${process.env.SUFFIX || "defualt"}`)
});
// #endregion

// #region Primary command identifier
Bot.client.on('message', async msg => {
	if(msg.author.bot) return;
	if(msg.channel.type === 'dm') return;

	let command = Bot.evaluateMsg(msg, );

	if (msg.content === '<prefix>') {
		const req = await GuildModel.findOne({ id: msg.guild.id });
		if (!req) return require('./util/errMsg').run(Bot, msg, true, 'Something went wrong while loading your servers prefix/suffix\nPlease report this to our support server: https://discord.gg/GUvk7Qu');
		const prefixembed = new MachinaMessage({
			title: 'Server Prefix & Suffiix:',
			description: `Prefix:  ${req.prefix}\nSuffix:  ${req.suffix}\n`,
			color: msg.member.displayHexColor,
			footer: {
				'text': msg.author.username,
				'icon_url': msg.author.displayAvatarURL(),
			},
			timestamp: Date.now(),
		}, msg);
		return msg.channel.send(prefixembed);
	}
	else if(msg.content === '<prefix reset>') {
		if(!msg.member.hasPermission('ADMINISTRATOR')) return require('./util/errMsg.js').run(Bot, msg, false, 'You do not have proper perms');
		await GuildModel.findOneAndUpdate({ id: msg.guild.id }, { $set: { suffix: '>' } }, { new: true });
		await GuildModel.findOneAndUpdate({ id: msg.guild.id }, { $set: { prefix: '<' } }, { new: true });
		const setprefixembed = await new MachinaMessage({
			title: 'Prefix Reset!',
			description: 'Prefix: <\nSuffix: >\n',
			color: msg.member.displayHexColor,
			footer: {
				'text': msg.author.username,
				'icon_url': msg.author.displayAvatarURL(),
			},
			timestamp: Date.now(),
		}, msg);
		return await msg.channel.send(setprefixembed);
	}

	const req = await GuildModel.findOne({ id: msg.guild.id });
	if(!!process.env.PREFIX) {req.prefix = process.env.PREFIX;}
	if(!!process.env.SUFFIX) {req.suffix = process.env.SUFFIX;}
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

	if(command.reason == "no commands available")
        return Machina.noCommands(msg, command.extra)
    else if(command.reason == "permission check passed multiple")
        return Machina.multipleCommands(msg, arrify(command.value))

    if(command.value)
		arrify(command.value).forEach(f => f(Bot, msg));
});
// #endregion

// #region  Node Network
Bot.client.on('message', async msg => {
	if(msg.author.bot) return;
	if(msg.channel.type === 'dm') return;
	if(!msg.channel.name.startsWith("node-")) return;

	let msgChannel = msg.channel as TextChannel;
	// creates new node network message
	const embed = new MachinaMessage({
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
	}, msg);
	const attachment = msg.attachments.first();
	if(attachment) embed.msg.embeds[0].setImage(attachment.url);

	if(msg.channel.name == "node-network") {
		Bot.client.guilds.cache.array().forEach(g => g.channels.cache.filter(c => c.name == 'node-network' && c != msg.channel).array().forEach((c: TextChannel) => c.send(embed)));
	} else {
		Bot.client.channels.cache.filter((c: TextChannel) => c.name == msgChannel.name && c.topic == msgChannel.topic && c != msgChannel).array().forEach((c: TextChannel) => c.send(embed));
	}

});

Bot.client.on('channelCreate', async (channel: TextChannel) => {
	if(channel.name != "node-network") return;
	if(channel.guild.channels.cache.filter(chn => chn.name == "node-network").size > 1) return;
	function getDate() {
		const today = new Date();
		const dd = String(today.getDate()).padStart(2, '0');
		const mm = String(today.getMonth() + 1).padStart(2, '0');
		const yyyy = today.getFullYear();

		return `${mm}/${dd}/${yyyy}`;
	}
	Bot.client.guilds.cache.array().forEach(async g => {
		try {
			let pinned = await (g.channels.cache.find((c: TextChannel) => c.name == 'node-network') as TextChannel).messages.fetchPinned();
			let message = await pinned.first();
			if(message.author.id == Bot.client.user.id) {
				const updatedEmbed = new MachinaMessage({
					title: `Welcome to the Node Network, ${g.name}.`,
					description: 'The Node Network connects a "network" of servers together through one channel.\nBe friendly to others or risk having your server blacklisted.\nTo start, just say Hi! (Bots do not work in Node Networks btw)',
					color: 0x07592b,
					fields: [
						{
							name: `Number of servers connected to the Node Network as of ${getDate()}:`,
							value: `\`\`\`js\n${Bot.client.guilds.cache.filter(g => g.channels.cache.has(g.channels.cache.find(c => c.name == 'node-network').id)).size}\`\`\``,
						},
					],
				},null,false)
				message.edit(updatedEmbed);
				if(g.channels.cache.find(c => c.name == 'node-network')) (g.channels.cache.find(c => c.name == 'node-network') as TextChannel).topic = "Welcome to the Node Network v1.1! Say Hi, and be friendly.";
			}
		} catch(e) {
			console.log(e.stack);
		}

	});
});
 
Bot.client.on('channelDelete', async (channel: TextChannel) => {
	if(channel.type != "text") return;
	if(channel.name != "node-network") return;
	if(channel.guild.channels.cache.filter(chn => chn.name == "node-network").size > 0) return;
	function getDate() {
		const today = new Date();
		const dd = String(today.getDate()).padStart(2, '0');
		const mm = String(today.getMonth() + 1).padStart(2, '0');
		const yyyy = today.getFullYear();

		return `${mm}/${dd}/${yyyy}`;
	}
	Bot.client.guilds.cache.filter(g => g.channels.cache.has(g.channels.cache.find(c => c.name == 'node-network').id)).array().forEach(async g => {
		try {
			let pinned = await (g.channels.cache.find(c => c.name == 'node-network')as TextChannel).messages.fetchPinned();
			let message = await pinned.first();
			if(message.author.id == Bot.client.user.id) {
				const updatedEmbed = new MachinaMessage({
					title: `Welcome to the Node Network, ${g.name}.`,
					description: 'The Node Network connects a "network" of servers together through one channel.\nBe friendly to others or risk having your server blacklisted.\nTo start, just say Hi! (Bots do not work in Node Networks btw)',
					color: 0x07592b,
					fields: [
						{
							name: `Number of servers connected to the Node Network as of ${getDate()}:`,
							value: `\`\`\`js\n${Bot.client.guilds.cache.filter(g => g.channels.cache.has(g.channels.cache.find(c => c.name == 'node-network').id)).size}\`\`\``,
						},
					],
				},null,false)
				message.edit(updatedEmbed);
				if(g.channels.cache.find(c => c.name == 'node-network')) (g.channels.cache.find(c => c.name == 'node-network')as TextChannel).topic = "Welcome to the Node Network v1.1! Say Hi, and be friendly.";
			}
		} catch(e) {
			console.log(e.stack);
		}

	});
});


// #endregion

// #region determines which token you are using
// test bot if not in production, defaualts to production -- Hamziniii 🎩
if(process.env.PRODUCTION == "false") {
	if(!process.env.BOT)
		console.log("Please set BOT equal to TESTTOKEN, TEST2TOKEN, or TEST3TOKEN in your env file")
	else if(!!process.env[process.env.BOT])
		Bot.client.login(process.env[process.env.BOT])
	else
		console.log(process.env.BOT + " is not set in your .env file")
}
else {
	console.log('production')
	Bot.client.login(process.env.TOKEN);
}
// #endregion
