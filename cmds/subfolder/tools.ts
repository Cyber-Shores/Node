import { Collection, TextChannel, MessageEmbed, Message } from 'discord.js';
import { machinaDecoratorInfo, MachinaFunction, MachinaFunctionParameters, MachinaMessage } from "machina.ts";

import ms = require('ms');

export const ping: MachinaFunction = machinaDecoratorInfo
({monikers: ["ping", "uptime"], description: "Gets bot ping and shows the uptime of the bot"})
("Tool", "ping", async (params: MachinaFunctionParameters) => {
    const pingingembed = new MessageEmbed({
        title: 'Pinging...',
        thumbnail: {
            url: 'https://cdn.discordapp.com/emojis/476877098947182614.gif?v=1'
        }
    });
    const UPTIME = params.Bot.client.uptime;

    let h, m, s;
    h = Math.floor(UPTIME / 1000 / 60 / 60);
    m = Math.floor((UPTIME / 1000 / 60 / 60 - h) * 60);
    s = Math.floor(((UPTIME / 1000 / 60 / 60 - h) * 60 - m) * 60);

    s < 10 ? s = `0${s}` : s = `${s}`;
    m < 10 ? m = `0${m}` : m = `${m}`;
    h < 10 ? h = `0${h}` : h = `${h}`;

    console.log(pingingembed)
    try{
        let mes = await params.msg.channel.send(pingingembed)
        console.log(mes);
        const ping = mes.createdTimestamp - params.msg.createdTimestamp;

        const pingembed = new MessageEmbed({
            title: 'Pong',
            description: `${ping}ms`,
            fields: [
                {
                    name: "**Uptime**",
                    value: `I have been online for roughly ${ms(params.Bot.client.uptime, { long: true })}\`\`\`${h}:${m}:${s}\`\`\``,
                }
            ],
            color: params.msg.member.displayHexColor,
            footer: {
                'text': params.msg.author.username,
                'icon_url': params.msg.author.displayAvatarURL(),
            },
            timestamp: Date.now(),
        });

        console.log(pingembed);

        params.msg.channel.send(pingembed);

        mes.delete();
    }
    catch(e){
        console.log(e.stack);
    }
});

export const clear: MachinaFunction = machinaDecoratorInfo
({monikers: ["purge", "clear"], description: "Bulk deletes a number of messages from a channels history. From a specified user or from everyone."})
("Admin-Tool", "clear", async (params: MachinaFunctionParameters) => {
    const NONADMINMAX = 10 // The amount of messages that people without admin but with manage message perms can delete
    if(!params.msg.member.hasPermission('MANAGE_MESSAGES')) return require('../../util/errMsg.ts').run(params.Bot, params.msg, false, 'You do not have proper perms');
    const user = params.msg.mentions.users.first();
    // Parse Amount
    let amount: number;
    let previousAmount = amount = parseInt(params.msg.content.split(' ')[0]) ? parseInt(params.msg.content.split(' ')[0]) : parseInt(params.msg.content.split(' ')[1]);
    if (!amount) return require('../../util/errMsg.ts').run(params.Bot, params.msg, true, 'Must specify a number of messages to delete.');
    if (!amount && !user) return require('../../util/errMsg.ts').run(params.Bot, params.msg, true, 'Must specify a user and a number of, or just a number of, messages to delete.');

    // Fetch 100 messages (will be filtered and lowered up to max amount requested)
    if(!params.msg.member.hasPermission("ADMINISTRATOR"))
        if((amount = Math.min(amount, NONADMINMAX)) != previousAmount)
            require('../../util/suggestMsg.js').run(params.Bot.client, params.msg, 'Delete count is capped at ' + NONADMINMAX + ' for non admins. I just thought I would let you know :)').then(_ => _.delete({timeout: 5000}))

    if(user) {
        const userchannel = (params.msg.channel as TextChannel);
        userchannel.messages.fetch({
            limit: 100,
        }).then((messages) => {
            let messageArr: Collection<string, Message> | Message[] | string[];
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

export const embed: MachinaFunction = machinaDecoratorInfo
({monikers: ["embed"], description: "creates a custom embed based on tag arguments"})
("Admin-Tool", "embed", async (params: MachinaFunctionParameters) => {

	// const strings = args.join(' ').split('|');
	if(!params.msg.member.hasPermission('MANAGE_MESSAGES')) return require('../../util/errMsg.ts').run(params.Bot, params.msg, false, 'You do not have proper perms');
    // if(!strings[0] || !strings[1] || !strings[2]) return require('../../util/errMsg.js').run(bot, msg, true, 'Please fill out all parameters!');
    let embedArgs = params.msg.content.split(' -').slice(1);
    console.log(embedArgs);
    let frame = new MessageEmbed();
    embedArgs.forEach(arg => {
        // if(arg.length == 0) return require('../../util/errMsg.ts').run(params.Bot, params.msg, true, `"${arg}" is not a valid argument flag`);
        try {
            let input = arg.substring(2, arg.length);
            console.log(input);
            console.log(arg.substring(0,2));
            switch (arg.substring(0,2)) {
                case 'c ':
                    frame.setColor(input);
                    break;
                case 't ':
                    frame.setTitle(input);
                    break;
                case 'l ':
                    frame.setURL(input);
                case 'a ':
                    let authorArgs = input.split('~');
                    frame.setAuthor(authorArgs[0] || input, authorArgs[1] || null, authorArgs[2] || null);
                    break;
                case 'd ':
                    frame.setDescription(input);
                    break;
                case 'n ':
                    frame.setThumbnail(input);
                    break;
                case 'f ':
                    let fields = input.split('~');
                    fields.forEach(field => {
                        let fieldArgs = field.split(',');
                        frame.addField(fieldArgs[0] || field || input, fieldArgs[1] || " ", Boolean(fieldArgs[2]) || false);
                    });
                    break;
                case 'i ':
                    frame.setImage(input);
                    break;
                case 's':
                    frame.setTimestamp(new Date());
                    break;
                case 'o ':
                    let footerArgs = input.split('~');
                    frame.setFooter(footerArgs[0], footerArgs[1])
            }
            
        }
        catch(e){
            return require('../../util/errMsg.ts').run(params.Bot, params.msg, false, `Something went wrong with this arg: \n \`\`\`${arg}\`\`\``);
        }
    });
    params.msg.channel.send(frame);
});


export const cleardata: MachinaFunction = machinaDecoratorInfo
({monikers: ["cleardata"], description: "Clears all of your user data that Node is storing."})
("Tool", "cleardata", async (params: MachinaFunctionParameters) => {
    const UserModel = require('../../models/UserBio');
    const m = await params.msg.channel.send('```Locating Data...```');
	const req = await UserModel.findOne({ id: params.msg.author.id });
	let nodata = new MessageEmbed({
		title: 'Data Clear!',
			description: `No data found on ${params.msg.author.tag}`,
			footer: {
				text: `${params.msg.author.username}`,
				icon_url: `${params.msg.author.displayAvatarURL()}`,
			},
			timestamp: new Date(),
			color: (params.msg.member.displayHexColor),
		});

	if (!req) {
		m.delete();
		return params.msg.channel.send(nodata)
	}else {
		m.delete()
		const m2 = await params.msg.channel.send('```Deleting Data...```');
		let embed = new MessageEmbed({
			title: 'Data Cleared!',
			description: `All of ${params.msg.author.tag}'s data has been deleted!`,
			footer: {
				text: `${params.msg.author.username}`,
				icon_url: `${params.msg.author.displayAvatarURL()}`,
			},
			timestamp: new Date(),
		    color: (params.msg.member.displayHexColor),
	    });

		await req.deleteOne({ id: params.msg.author.id, fuction(err: any) {
		    if(err) throw err;
		}});
	    m2.delete();
	    params.msg.channel.send(embed)
	}
});