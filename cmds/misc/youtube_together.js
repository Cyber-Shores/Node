"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const config = module.require('../../config.json');
module.exports.run = async (bot, msg, args) => {
    // const m = await msg.channel.send('```Starting Youtube Together...```'); // CREDIT TO Snowflake107
    try {
        // console.log("hello")
        // if(!msg.member.voice.channel) {
        // 	await m.edit('\`\`\`Sorry, you are not in a voice channel\`\`\`')
        // 	return 
        // }
        // let returnData = 'empty'
        // fetch(`https://discord.com/api/v8/channels/${msg.member.voice.channelID}/invites`, {
        //             method: 'POST',
        //             body: JSON.stringify({
        //                 max_age: 86400,
        //                 max_uses: 0,
        //                 target_application_id: '755600276941176913',
        //                 target_type: 2,
        //                 temporary: false,
        //                 validate: null
        //             }),
        //             headers: {
        //                 'Authorization': `Bot ${bot.token}`,
        //                 'Content-Type': 'application/json'
        //             }
        //         })
        // 		.then(res => res.json())
        //             .then(invite => {
        //                 if (invite.error || !invite.code) {
        //                     throw new Error('An error occured while retrieving data !');
        // 					// console.log(invite.error || !invite.code)
        //                 };
        //                 returnData = `https://discord.com/invite/${invite.code}`
        // 				m.edit(`\`\`\` Join here -> \`\`\`` + returnData)
        //             })
        const channel = msg.member.voice.channel || msg.mentions.channels.first() || msg.guild.channels.cache.get(args[0]);
        if (!channel || channel.type !== "voice")
            return msg.channel.send("❌ | Must join a channel first! Directions here: <https://imgur.com/Pea0Wi2>");
        if (!channel.permissionsFor(msg.guild.me).has("CREATE_INSTANT_INVITE"))
            return msg.channel.send("❌ | I need `CREATE_INSTANT_INVITE` permission");
        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: "755600276941176913",
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${bot.token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(invite => {
            if (invite.error || !invite.code)
                return msg.channel.send("❌ | Could not start **YouTube Together**!");
            msg.channel.send(`✅ | Click here to start **YouTube Together** in ${channel.name}: <https://discord.gg/${invite.code}>`);
        })
            .catch(e => {
            console.log(e);
            msg.channel.send("❌ | Could not start **YouTube Together**!");
        });
    }
    catch (e) {
        // m.delete();
        console.log(e);
        return require('../../util/errMsg.js').run(bot, msg, false, 'oops! something went wrong with youtube together!');
    }
};
module.exports.help = {
    name: 'youtube_together',
    category: 'Misc.',
    reqPerms: ["CREATE_INSTANT_INVITE"],
    description: 'Joins your voice channel and starts youtube together',
    usage: `${config.pref}youtube_together${config.suff}`,
    aliases: ['ytt', 'youtubetogether', 'youtogether', 'youtube'],
};
