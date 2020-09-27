import { Collection, TextChannel, MessageEmbed, Message } from 'discord.js';
import { machinaDecoratorInfo, MachinaFunction, MachinaFunctionParameters, MachinaMessage } from "machina.ts";

export const network: MachinaFunction = machinaDecoratorInfo
({monikers: ["network"], description: "Creates a NodeNetwork channel where you can talk to fellow Node using servers across Discord!"})
("social", "network", async (params: MachinaFunctionParameters) => {
	if(!params.msg.member.hasPermission('MANAGE_CHANNELS')) return require('../../util/errMsg.ts').run(params.Bot.client, params.msg, false, 'You do not have proper perms');
	function getDate() {
		const today = new Date();
		const dd = String(today.getDate()).padStart(2, '0');
		const mm = String(today.getMonth() + 1).padStart(2, '0');
		const yyyy = today.getFullYear();

		return `${mm}/${dd}/${yyyy}`;
	}
	if(!params.args[0]) {
		let channel: TextChannel;
		try {
			channel = await params.msg.guild.channels.create('node-network', {
				type: 'text',
				topic: 'Welcome to the Node Network v1.1! Say Hi, and be friendly.',
				nsfw: true,
				reason: 'For connection to the Node Network',

			});
			channel.send(new MessageEmbed({
				title: `Welcome to the Node Network, ${params.msg.guild.name}.`,
				description: 'The Node Network connects a "network" of servers together through one channel.\nBe friendly to others or risk having your server blacklisted.\nTo start, just say Hi! (Bots do not work in Node Networks btw)',
				color: 0x07592b,
				fields: [
					{
						name: `Number of servers connected to the Node Network as of ${getDate()}:`,
						value: `\`\`\`js\n${params.Bot.client.guilds.cache.filter(g => g.channels.cache.find((c: TextChannel) => c.name == 'node-network') != undefined).size}\`\`\``,
					},
				],
			})).then((m: { pin: () => any; }) => m.pin());
			params.msg.channel.send(new MessageEmbed({
				title: `${params.msg.guild.name} successfully connected to the Node Network!`,
				description: `<#${channel.id}>`,
				color: params.msg.member.displayHexColor,
				timestamp: new Date(),
				footer: {
					text: `${params.msg.author.username}`,
					icon_url: `${params.msg.author.displayAvatarURL()}`,
				},
			}));
		}
		catch(e) {
			console.log(e.stack);
			return require('../../util/errMsg.ts').run(params.Bot.client, params.msg, false, 'Uh Oh, failed to properly generate a Node Network channel!\nIf a channel was created, delete it then please report this in our support server: https://discord.gg/GUvk7Qu');
		}
	} else {
		if(!params.args[1]) return require('../../util/errMsg.ts').run(params.Bot.client, params.msg, true, `Must initialize the custom network with a name and 5 digit numeric password\ne.g. ${params.Bot.PREFIX}network Test 00000`);
        if((params.args[0] as string).length > 95) return require('../../util/errMsg.ts').run(params.Bot.client, params.msg, true, "Name must be 95 characters or less");
        console.log(params.args);
        if(String(params.args[1]).length != 5) return require('../../util/errMsg.ts').run(params.Bot.client, params.msg, true, "Password must contain exactly 5 digits");
        params.args[1] = String(params.args[1])
		for(let i = 0; i < (params.args[1]).length; i++) {
			if(isNaN(parseInt((params.args[1]).substring(i,i+1)))) return require('../../util/errMsg.ts').run(params.Bot.client, params.msg, true, "Password may only contain numbers");
		}
		let channel;
		try {
			channel = await params.msg.guild.channels.create(`node-${params.args[0]}`, {
				type: 'text',
				topic: `${params.args[0]} ${params.args[1]}`,
				nsfw: true,
				reason: 'For connection to the Node Network',

			});
			channel.send(new MessageEmbed({
				title: `Welcome to the ${params.args[0]} custom Node Network, ${params.msg.guild.name}.`,
				color: params.msg.member.displayHexColor,
				fields: [
					{
						name: `Number of servers connected to this custom Node Network as of ${getDate()}:`,
						value: `\`\`\`js\n${params.Bot.client.guilds.cache.filter(g => g.channels.cache.find(c => c.name == `node-${params.args[0]}`) != undefined).size}\`\`\``,
					},
				],
			})).then((m: { pin: () => any; }) => m.pin());
			params.msg.channel.send(new MessageEmbed({
				title: `${params.msg.guild.name} successfully connected to the ${params.args[0]} Network!`,
				description: `<#${channel.id}>`,
				color: params.msg.member.displayHexColor,
				timestamp: new Date(),
				footer: {
					text: `${params.msg.author.username}`,
					icon_url: `${params.msg.author.displayAvatarURL()}`,
				},
			}));
		}
		catch(e) {
			console.log(e.stack);
			return require('../../util/errMsg.ts').run(params.Bot.client, params.msg, false, 'Uh Oh, failed to properly generate a Node Network channel!\nIf a channel was created, delete it then please report this in our support server: https://discord.gg/GUvk7Qu');
		}

	}

});