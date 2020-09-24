import { Collection, TextChannel, MessageEmbed } from 'discord.js';
import ms = require('ms');
import { machinaDecoratorInfo, MachinaFunction, MachinaFunctionParameters, MachinaMessage } from "machina.ts"
export const randomNumber: MachinaFunction = machinaDecoratorInfo
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