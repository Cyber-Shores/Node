const snek = module.require('snekfetch');
const Discord = module.require("discord.js");
const config = module.require("../../config.json");
const api = "http://aws.random.cat/meow";
module.exports.run = async (bot, msg, args) => {
    let m = await msg.channel.send("```Generating image...```");
    let file = ( await snek.get(api)).body.file;
    if(!file) return require('../../util/errMsg.js').run(bot, msg, true, "I broke! Please try again or contact the developer!");

    let attach = await new Discord.MessageAttachment(file, file.split("/").pop());
    msg.channel.send(attach);
    m.delete();
}

module.exports.help = {
    name: "cat",
    reqPerms: [],
    description: "Posts a random cat image",
    usage: `${config.pref}cat${config.suff}`,
    aliases: ['kitten', 'kitty']
}