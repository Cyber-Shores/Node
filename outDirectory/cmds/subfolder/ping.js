"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomNumber = void 0;
const discord_js_1 = require("discord.js");
const ms = require("ms");
const machina_ts_1 = require("machina.ts");
exports.randomNumber = machina_ts_1.machinaDecoratorInfo({ monikers: ["ping", "uptime"], description: "Gets bot ping and shows the uptime of the bot" })("Tool", "ping", async (params) => {
    const pingingembed = new discord_js_1.MessageEmbed({
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
    console.log(pingingembed);
    params.msg.channel.send(pingingembed).then(m => {
        console.log(m);
        const ping = m.createdTimestamp - params.msg.createdTimestamp;
        const pingembed = new machina_ts_1.MachinaMessage({
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
        }, params.msg);
        console.log(pingembed);
        params.msg.channel.send(pingembed);
        m.delete();
    });
});
