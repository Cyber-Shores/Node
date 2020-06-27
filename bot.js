require('dotenv').config();
const config = require('./config.json');
const Discord = require('discord.js');
const { Client, MessageEmbed } = require('discord.js');
const bot = new Client();
const fs = require('fs');
const mongoose = require('mongoose');
const GuildModel = require('./models/GuildData');


// const DBL = require("dblapi.js");  (WIP) cannot finish until bot gets approved on top.gg
// const dbl = new DBL('', bot);

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

// start of connecting to database
// process.env.MONGOLINK used to hide password
mongoose.connect(process.env.MONGOLINK, {
	// mongo connect settings
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
	// end
}).then(console.log('\nMongoDB connected!\n'));
// end

// start of command reading
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
// end

// Getting stuff prepared for ready
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

// Things to do on guild join
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
// end

// Stuff to do on guild leave
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
// end

// Custom prefixes
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
// end

// Final ready
bot.on('ready', async () => {
	console.log(`${bot.user.username} is online!`);
});
// end

// Primary command identifier
bot.on('message', async msg => {
	const req = await GuildModel.findOne({ id: msg.guild.id });

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
	}else if(msg.content === '<prefix reset>') {
		await GuildModel.findOneAndUpdate({ id: msg.guild.id }, { $set: { suffix: `>` } }, { new: true });
		await GuildModel.findOneAndUpdate({ id: msg.guild.id }, { $set: { prefix: `<` } }, { new: true });
		const setprefixembed = await new MessageEmbed({
			title: 'Prefix Reset!',
			description: `Prefix: <\nSuffix: >\n`,
			color: msg.member.displayHexColor,
			footer: {
				'text': msg.author.username,
				'icon_url': msg.author.displayAvatarURL(),
			},
			timestamp: Date.now(),
		});
		return await msg.channel.send(setprefixembed);
	}

	let args = '';
	if(msg.content.includes(req.prefix) && msg.content.includes(req.suffix)) {
		args = msg.content.slice(msg.content.indexOf(req.prefix) + req.prefix.length, msg.content.indexOf(req.suffix)).trim().split(/ +/g);
	}
	else{
		return;
	}
	const cmd = args.shift().toLowerCase();
	let command;
	if(bot.commands.has(cmd)) {
		command = bot.commands.get(cmd);
	}
	else {
		command = bot.commands.get(bot.aliases.get(cmd));
	}
	if(command) command.run(bot, msg, args, config);

});
// end

// Node Network
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
// end
// test bot if not in production, defaualts to production -- Hamziniii 🎩
if(process.env.PRODUCTION != undefined)
	process.env.PRODUCTION == "true" ? bot.login(process.env.TOKEN) : process.env.TEST2TOKEN ? bot.login(process.env.TEST2TOKEN) : bot.login(process.env.TESTTOKEN)
else 
	bot.login(process.env.TOKEN)