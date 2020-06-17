const Discord = module.require("discord.js");
const { Client, MessageEmbed } = module.require('discord.js');
const config = module.require("../config.json");
module.exports.run = async (bot, msg, isWarn, text) => {
    function genWarn(){
        if(isWarn) return ['⚠️', 'YELLOW'];
        return ['❌', 'RED'];
    }
    let embed = new MessageEmbed({
        title: "**Error**",
        description: `${genWarn()[0]} ${text}`,
        color: genWarn()[1],
        footer: {
            "text": msg.author.username,
            "icon_url": msg.author.displayAvatarURL()
        },
        timestamp: Date.now()
    });
    msg.channel.send(embed);
}

module.exports.help = {
    name: "errMsg",
    description: "Generates an error message embed"
}