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