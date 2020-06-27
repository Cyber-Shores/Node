const Discord = module.require("discord.js");
const { Client, MessageEmbed } = module.require('discord.js');
const config = module.require("../config.json");
module.exports.run = async (bot, msg, text) => {
    let embed = new MessageEmbed({
        title: "**Notice**",
        description: `🔍 ${text}`,
        color: "#BCBCBC",
        footer: {
            "text": msg.author.username,
            "icon_url": msg.author.displayAvatarURL()
        },
        timestamp: Date.now()
    });
    return msg.channel.send(embed);
}
// This is useful for suggestions that are not warnings or errors per se -- Hamziniii 🎩
module.exports.help = {
    name: "suggestMsg",
    description: "Generates an suggestion message embed"
}