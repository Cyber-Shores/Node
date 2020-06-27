"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.help = exports.run = void 0;
const config_json_1 = require("../../config.json");
const eM = require("../../util/errMsg.js");
const discord_js_1 = require("discord.js");
async function run(bot, msg, args) {
    if (args[0] == "permissions")
        return msg.channel.send(new discord_js_1.MessageEmbed().setDescription("🚩 All the permission flags:\n\`\`\`" + Object.keys(discord_js_1.Permissions.FLAGS).join("\n") + "\`\`\`").setTitle("Permissions").setColor(msg.member.displayHexColor).setFooter(msg.member.nickname || msg.author.username, msg.author.avatarURL()).setTimestamp());
    args = args.map(_ => _.replace(",", ""));
    let bF = msg.guild.me.permissions;
    if (!args.every(_ => discord_js_1.Permissions.FLAGS[_]))
        return eM.run(bot, msg, false, "One or more of the permissions that you sent weren't actually permissions.\n" + `try \`${config_json_1.pref}invite permissions${config_json_1.suff}\` to see all of the permissions`);
    else {
        if (!args.forEach(_ => bF = bF.add(_)) && bF.bitfield == msg.guild.me.permissions.bitfield)
            return msg.channel.send(new discord_js_1.MessageEmbed().setDescription("This bot already has the permissions inputted currently (from roles or invite)").setTitle("Invitation").setColor(msg.member.displayHexColor).setFooter(msg.member.nickname || msg.author.username, msg.author.avatarURL()).setTimestamp());
        else
            return msg.channel.send(new discord_js_1.MessageEmbed().setDescription("Click the title!").setAuthor("Invitation", undefined, `https://discord.com/oauth2/authorize?client_id=${bot.user.id}&permissions=${bF.bitfield}&scope=bot`).setColor(msg.member.displayHexColor).setFooter(msg.member.nickname || msg.author.username, msg.author.avatarURL()).setTimestamp());
    }
}
exports.run = run;
exports.help = {
    name: 'invitation',
    category: 'Admin Tools',
    reqPerms: [],
    description: 'Generates an invite link with perms',
    usage: `${config_json_1.pref}invite [permission1] [...]${config_json_1.suff}`,
    aliases: [],
};
